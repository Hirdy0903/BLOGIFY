const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const { router: userRoute } = require('./routes/user');
const { router: blogRoute } = require('./routes/blog');
const { checkForAuthenticatioInCookiee } = require('./middleware/authentication');
const { Blog } = require('./models/blogs');

const app = express();
const port = 9987;

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

app.get('/', async (req, res) => {
  const allBlogs = await Blog.find({});

  return res.render('homepage', {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use('/user', userRoute);
app.use('/blog', blogRoute);

if (require.main === module) {
  mongoose
    .connect(
      'mongodb+srv://hirdyanshsaxena7:HIRDY0903@hirdyansh.4gmlqyu.mongodb.net/Blogwill'
    )
    .then(() => {
      console.log('Connected to DB');
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
    });

  app.listen(port, () => {
    console.log('server is running on port ' + port);
  });
}

module.exports = { app };