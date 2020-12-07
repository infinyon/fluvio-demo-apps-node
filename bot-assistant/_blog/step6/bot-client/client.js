const express = require('express');
const path = require('path');
const app = express();

const PORT = 9999;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use("/scripts", express.static(__dirname + "/scripts"));
app.use("/css", express.static(__dirname + "/css"));
app.use("/img", express.static(__dirname + "/img"));

app.listen(PORT, () => {
    console.log(`listening http://localhost:${PORT}`);
});
