const mongoose = require('mongoose');

const connection = mongoose.createConnection('mongodb+srv://admin:powerpupbois@cluster0.uriyxxs.mongodb.net/ekumpas?retryWrites=true&w=majority&appName=Cluster0').on('open', () => {
    console.log("Mongodb Connected");
}).on('error', () => {
    console.log("Connection Error");
});

module.exports = connection;