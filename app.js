const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
require('dotenv').config();

const { router: userRoute } = require('./routes/user');
const { router: blogRoute } = require('./routes/blog');
const { checkForAuthenticatioInCookiee } = require('./middleware/authentication');
const { Blog } = require('./models/blogs');
const { globalErrorHandler } = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 9987;
app.use(helmet());
//dont need a cors because we are using a monolith app mtlb dono ek sath fronend and backend

mongoose
  .connect(process.env.URI)
  .then(() => {
    console.log('Connected to DB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(checkForAuthenticatioInCookiee('token'));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.get('/', async (req, res, next) => {
  try {
    const allBlogs = await Blog.find({});
    return res.render('homepage', {
      user: req.user,
      blogs: allBlogs,
    });
  } catch (error) {
    next(error);
  }
});

app.use('/user', userRoute);
app.use('/blog', blogRoute);

app.use(globalErrorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));