const express = require("express");

const bodyParser = require("body-parser");

const authRoutes = require('./routes/auth');

const errorController = require('./controllers/error');

const app = express();

const ports = process.env.PORT || 3000;

const postRoutes = require('./routes/posts');

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/auth', authRoutes);

app.use('/posts', postRoutes);

app.use(errorController.get404);

app.use(errorController.get500);

const fs = require('fs');
const https = require('https');

// Load SSL key + cert
const sslOptions = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert'),
};

https.createServer(sslOptions, app).listen(3000, () => {
  console.log('HTTPS server running at https://localhost:3000');
});