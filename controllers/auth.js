const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');

const User = require('../models/user');

const jwt = require('jsonwebtoken');

// Secret keys (in production, store in .env)
const ACCESS_TOKEN_SECRET = 'youraccesstokensecret';
const REFRESH_TOKEN_SECRET = 'yourrefreshtokensecret';

let refreshTokens = []; // Temporary storage 

exports.signup = async (req, res, next) =>{
    const errors = validationResult(req);

    if(!errors.isEmpty()) return res.status(422).json({errors: errors.array()});

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    try{
        const hashedPassword = await bcrypt.hash(password, 12)

        const userDetails = {
            name: name,
            email: email,
            password: hashedPassword
        }

        const result = await User.save(userDetails);

        res.status(201).json({message: "User registered."})
    }catch (err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err)
    }
}

exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const email = req.body.email;
  const password = req.body.password;

  try {
    const [user] = await User.find(email);

    if (user.length === 0) {
      return res.status(401).json({ error: { message: "Email not found." } });
    }

    const isEqual = await bcrypt.compare(password, user[0].password);

    if (!isEqual) {
      return res.status(401).json({ error: { message: "Incorrect password." } });
    }

    const userPayload = {
      id: user[0].id,
      email: user[0].email
    };

    const accessToken = jwt.sign(userPayload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(userPayload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    refreshTokens.push(refreshToken); // Store the refresh token

    res.status(200).json({
      message: "Login successful!",
      accessToken,
      refreshToken
    });

  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

