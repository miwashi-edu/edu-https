const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`HTTP Server is running on https://localhost:${PORT}`);
});
