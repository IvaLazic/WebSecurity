const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const Post = require('../models/post');
const ACCESS_TOKEN_SECRET = 'youraccesstokensecret';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [posts] = await Post.getByUserId(userId);
    res.status(200).json({ posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch posts.' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }

  try {
    await Post.create(title, content, userId);
    res.status(201).json({ message: 'Post created successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create post.' });
  }
});

module.exports = router;
