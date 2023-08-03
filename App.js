// import express from 'express';
// import fetch from 'node-fetch';
// import 'dotenv/config';
// import asyncHandler from 'express-async-handler';

// forever start app.js.


// Setup section- contains variables
var express = require('express');
var app = express();
var db = require('./database/database_connector');
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');
app.engine('.hbs', engine({ extname: ".hbs" }));
app.set('view engine', '.hbs');
PORT = 4020;


//Route section- contains paths server will respond to
// Testing
//app.get('/', function (req, res) {
//    res.send("The server is running!")
//});

app.get('/', function (req, res) {
    let allMovies = "SELECT * FROM Movies";                      //Define query (will show all movies)
    db.pool.query(allMovies, function (error, rows, fields) {    //Execute the query
        res.render('index', { data: rows });                     //Render index.hbs file and send data back as rows
    })
});

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/requested_Movies_available', async (request, response, next) => {
    try {

    }
    catch (error) {
        response.status(500).send(error.message)
        window.alert("Error Occurred")
    }
});

app.get('', () => {
    try {

    }
    catch (error) {
        response.status(500).send(error.message)
        window.alert("Error Occurred")
    }
});



// Listener section- makes server work
// Note: Don't add or change anything below this line.
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});