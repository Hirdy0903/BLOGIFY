
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
  const body = req.body || {};
  const fullName = (body.fullName || '').trim();
  const email = (body.email || '').trim().toLowerCase();
  const password = body.password;

  if (!fullName || !email || !password) {
    return res.status(400).send('Full name, email, and password are required.');
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .send('An account with this email already exists. Please sign in.');
    }

    await User.create({
      FullName: fullName,
      email,
      Password: password,
    });

    return res.redirect('/');
  } catch (error) {
    console.error('Error creating user:', error.message);
    return res.status(500).send('Error: ' + error.message);
  }
});
router.post('/signin',async(req,res)=>{
  const {email,password}=req.body;
  try{
    const token=await User.validatePasswordandgeneratetoken(email,password);
  console.log(token);
  return res.cookie('token',token).redirect('/');
  }
  catch(error){
    return res.render('signin', { error: 'Invalid email or password.' });
  }


})
router.get("/signout",(req,res)=>{
  res.clearCookie('token').redirect("/");
})
module.exports = { router };