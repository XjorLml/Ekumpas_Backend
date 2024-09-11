const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRouter = require('./routers/user_router');

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use('/', userRouter);

// Add this route to return "Backend server running" in the browser
app.get('/', (req, res) => {
    res.send('Backend server running');
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Server is running' });
});

module.exports = app;
