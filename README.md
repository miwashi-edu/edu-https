# edu-https

## Instructions

```bash
cd ~
cd ws
rm -rf https-test #Om den finns
mkdir https-test && cd https-test
npm init -y
mkdir src
mkdir certs
touch ./src/app.js
touch ./src/service.js
touch ./src/secure_service.js
npm pkg set scripts.start="node ./src/app.js"
npm pkg set scripts.dev="node --watch ./src/app.js"
npm pkg set scripts.test="jest"
npm install express
npm install -D concurrently
echo "node_modules" > .gitignore
git init
git add .
git commit -m "Initial commit"
```

## Generate certificates

```bash
#!/bin/bash

# Certificate config
cat > ./certs/openssl-subj.cnf <<EOF
[ req ]
distinguished_name = req_distinguished_name

[ req_distinguished_name ]
C = US                      # Country Name
ST = California             # State or Province Name
L = San Francisco           # Locality Name (City)
O = MyOrganization          # Organization Name
OU = MyDepartment           # Organizational Unit Name
CN = localhost              # Common Name (e.g., domain name)
EOF
```


```bash
openssl genrsa -out ./certs/server.key 2048
openssl req -new -key ./certs/server.key -out ./certs/server.csr -config ./certs/openssl-subj.cnf
openssl x509 -req -in ./certs/server.csr -signkey ./certs/server.key -out ./certs/server.cert -days 365
```

## app.js >heredoc!

```js
cat > ./src/app.js << 'EOF'
const express = require('express');
const app = express();
app.use(express.json());
/*
app.get('*', (req, res, next) => {
    if (!req.secure) {
        const securePort = process.env.SECURE_PORT || 443;
        const host = req.hostname;
        const url = `https://${host}:${securePort}${req.originalUrl}`;
        console.log(`Redirecting to: ${url}`);
        res.redirect(url);
    }
    next();
});
*/
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
EOF
```

## service.js >heredoc!

```js
cat > ./src/service.js << 'EOF'
const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`HTTPS Server is running on https://localhost:${PORT}`);
});

EOF
```

## secure_service.js >heredoc!

```js
cat > ./src/secure_service.js << 'EOF'
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
EOF
```
