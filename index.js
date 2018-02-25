// server.js

const express        = require('express');
const morgan  		 = require("morgan");
const bodyParser     = require('body-parser');
const mongoose   	 = require("mongoose");
const MongoClient    = require('mongodb').MongoClient;
const db             = require('./config/db');
const app            = express();
var KeySet     = require('./models/KeySet');
mongoose.connect(db.url);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

MongoClient.connect(db.url, (err, database) => {
    if (err) return console.log(err);

require('./app/routes')(app, {});
app.listen(db.port, () => {
    console.log('We are live on ' + db.port);
});
})