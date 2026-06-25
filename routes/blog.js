const { Router } = require('express');
const multer = require('multer');
const path = require('path');

const { Blog } = require('../models/blogs');
const { Comment } = require('../models/comment');

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'));
  },

  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

router.get('/addnew', (req, res) => {

  return res.render('addBlogs', {
    user: req.user,
  });

});

router.get('/:id', async (req, res) => {

  const blog = await Blog.findById(req.params.id)
    .populate('author');

  const comments = await Comment.find({
    blogId: req.params.id,
  }).populate('author');

  return res.render('blog', {
    user: req.user,
    blog,
    comments,
  });

});

router.post('/comment/:blogId', async (req, res) => {

  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    author: req.user.id,
  });

  return res.redirect(`/blog/${req.params.blogId}`);

});

router.post('/', upload.single('coverImage'), async (req, res) => {

  const { title, body } = req.body;

  const blog = await Blog.create({
    title,
    body,
    author: req.user.id,

    coverImageUrl: req.file
      ? `/uploads/${req.file.filename}`
      : undefined,
  });

  return res.redirect(`/blog/${blog._id}`);

});

module.exports = { router };