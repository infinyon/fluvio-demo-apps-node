const express = require('express');
const path = require('path');
const app = express();

const PORT = 5052;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use("/scripts", express.static(__dirname + "/scripts"));

app.listen(PORT, () => {
    console.log(`listening http://localhost:${PORT}`);
});
