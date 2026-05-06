const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { router: userRoute } = require('./routes/user');

const app = express();
const port = 9987;

app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.get('/', (req, res) => {
  res.render('homepage');
});
app.use('/user', userRoute);

if (require.main === module) {
  mongoose
    .connect(
      'mongodb+srv://hirdyanshsaxena7:HIRDY0903@hirdyansh.4gmlqyu.mongodb.net/Blogwill',
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
