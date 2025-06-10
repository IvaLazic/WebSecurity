const express = require('express');

const {body} = require('express-validator');

const router = express.Router();

const User = require('../models/user');

const authController = require('../controllers/auth');

const { use } = require('react');

router.post(
    '/signup', 
    [
        body('name').trim().not().isEmpty(),
        body('email').isEmail().withMessage("Please enter a valid email.")
        .custom(async (email) => {
            const user = await User.find(email);
            if(user[0].length > 0){
                return Promise.reject("Email address already in use.")
            }
        })
        .normalizeEmail(), 
        body('password').trim().isLength({ min: 7})
    ], authController.signup
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage("Please enter a valid email.").normalizeEmail(),
    body('password').trim().not().isEmpty().withMessage("Password is required.")
  ],
  authController.login
);


router.post('/refresh-token', (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ message: 'Refresh token not valid' });
  }

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token expired or invalid' });

    const newAccessToken = jwt.sign({ id: user.id, email: user.email }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    res.status(200).json({ accessToken: newAccessToken });
  });
});


module.exports = router;