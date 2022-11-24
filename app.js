const express = require('express');

// const postsRouter = require('./routes/posts')
// const commentsRouter = require('./routes/comments')
const router = require('./routes/index')

const connect = require("./schemas");
connect();

const app = express();
const port = 3000;

app.use(express.json())

app.use('/api', router)

app.listen(process.env.PORT || 5000, () => {
    console.log(port, 'Server is open with port!');
})