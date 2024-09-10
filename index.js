const app = require('./app');
const db = require('./config/db');
const UserModel= require('./model/user.model');

const port = 3000;


app.listen(port, '0.0.0.0', () => {
    console.log(`Server is working localhost:${port}`);
  });