const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Voyage Blog!');
});

app.listen(port, () => {
    console.log(port, 'Server is open with port!');
});