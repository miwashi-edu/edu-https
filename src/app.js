const express = require('express');
const app = express();
app.use(express.json());

app.get('*', (req, res, next) => {
    if (!req.secure) {
        const securePort = process.env.SECURE_PORT || 443;
        const host = req.hostname;
        const url = `https://${host}:${securePort}${req.originalUrl}`;
        console.log(`Redirecting to: ${url}`);
        res.redirect(url);
    } else {
        next();
    }
});

app.get('/', (req, res) => {
    if (req.secure) {
        res.send('<h1>Hello, Secure World!</h1>');
    } else {
        res.send('<h1>Hello, Insecure World!</h1>');
    }
});

app.post('/', (req, res) => {
    res.status(201).send({success: "true"});
});

module.exports = app;

