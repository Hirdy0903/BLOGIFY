const { Router } = require('express');
const { User } = require('../models/user');
const { validateSignup } = require('../validators/validators');

const router = Router();

router.get('/signin', (req, res) => {
  res.render('signin', { error: null });
});

router.get('/signup', (req, res) => {
  res.render('signup', { errors: null, prevInput: {} });
});

router.post('/signup', validateSignup, async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).render('signup', {
        errors: { email: 'An account with this email already exists. Please sign in.' },
        prevInput: req.body
      });
    }

    // Double check these keys match your Schema design exactly:
    await User.create({
      FullName: fullName,
      email: email,
      Password: password,
    });

    return res.redirect('/');
  } catch (error) {
    next(error);
  }
});

router.post('/signin', async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const token = await User.validatePasswordandgeneratetoken(email, password);
    console.log(token);
    return res.cookie('token', token).redirect('/');
  } catch (error) {
    return res.render('signin', { error: 'Invalid email or password.' });
  }
});

router.get("/signout", (req, res) => {
  res.clearCookie('token').redirect("/");
});

module.exports = { router };