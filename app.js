const express = require('express');
const body_parser = require('body-parser');
const userRouter = require('./routers/user_router');

const app = express();

app.use(body_parser.json());
app.use('/', userRouter);

// Add this route to return "Backend server running" in the browser
app.get('/', (req, res) => {
    res.send('Backend server running');
});

module.exports = app;
