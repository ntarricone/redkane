const express = require('express');
var logger = require('morgan');
var path = require('path');
const app = express();
const bodyParser = require('body-parser');
const { mongoose } = require('./db.js'); //necessary to connect to ddbb even though it seems not in use
var cors = require('cors')

app.use(cors())


// Settings
app.set('port', 3000);

// Middlewares
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({origin: 'http://localhost:4200'}));

// Routes
app.use('/users',require('./routes/users.js'));
app.use('/articles',require('./routes/articles.js'));
app.use('/images',require('./routes/images.js'));
app.use('/videos',require('./routes/videos.js'));

// Starting the server
app.listen(app.get('port'), () => {
    console.log('server working on', app.get('port'))
})





