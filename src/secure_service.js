const https = require('https');
const fs = require('fs');
const app = require('./app');
const PORT = process.env.SECURE_PORTT || 443;

const tlsOptions = {
    key: fs.readFileSync('./certs/server.key'),
    cert: fs.readFileSync('./certs/server.cert')
};

https.createServer(tlsOptions, app).listen(PORT, () => {
    console.log(`HTTPS Server is running on https://localhost:${PORT}`);
});
