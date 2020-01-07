const mongoose = require('mongoose');
const dbconnection = 'mongodb://localhost:27017/redKane'

mongoose.connect(dbconnection, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(db => console.log('working connection with ddbb'))
    .catch(err => console.log(err));


module.exports = mongoose;