const { Router } = require('express');
const { User } = require('../models/user');
const router = Router();
router.get('/signin', (req, res) => {
  res.render('signin');
});
router.get('/signup', (req, res) => {
  res.render('signup');
});
router.post('/signup', async (req, res) => {
  console.log('Signup route hit, body:', req.body);
  const fullName = (req.body.fullName || '').trim();
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password;

  console.log(
    'Form data - fullName:',
    fullName,
    'email:',
    email,
    'password:',
    password,
  );

  if (!fullName || !email || !password) {
    return res.status(400).send('Full name, email, and password are required.');
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { Email: email }],
    });
    if (existingUser) {
      console.log('Existing user found, updating...');
      existingUser.FullName = fullName;
      existingUser.email = email;
      existingUser.Email = email;
      existingUser.Password = password;
      await existingUser.save();
      console.log('User updated successfully');
      return res.redirect('/');
    }

    console.log('Attempting to create user...');
    await User.create({
      FullName: fullName,
      email,
      Email: email,
      Password: password,
    });
    console.log('User created successfully');
    return res.redirect('/');
  } catch (error) {
    console.error('Error creating user:', error.message);
    console.error('Full error:', error);
    return res.status(500).send('Error: ' + error.message);
  }
});

module.exports = { router };
