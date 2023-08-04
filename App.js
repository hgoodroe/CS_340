// import express from 'express';
// import fetch from 'node-fetch';
// import 'dotenv/config';
// import asyncHandler from 'express-async-handler';

// forever start app.js.


// Setup section- contains variables
var express = require('express');
var app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('views'))

var db = require('./database/database_connector');

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');
app.engine('.hbs', engine({ extname: ".hbs" }));
app.set('view engine', '.hbs');

PORT = 4009;

// Route section - contains paths server will respond to Testing
// app.get('/', function (req, res) {
//     res.send("The server is running for Hunter & Samantha!")
// });

app.get('/', (request, response) => {

    response.render('index');

});

app.get('/Movies', function (req, res) {
    let allMovies = "SELECT * FROM Movies";                      //Define query (will show all movies)
    let allSub_Genres = "SELECT * FROM Sub_Genres";
    db.pool.query(allMovies, function (error, rows, fields) {    //Execute the query
        let movie = rows;

        db.pool.query(allSub_Genres, function (error, rows, fields) {
            let sub_genre = rows;
            let sub_genremap = {}
            sub_genre.map(sub_genre => {
                let id = parseInt(Sub_Genres.sub_genre_ID, 10);
                sub_genremap[id] = sub_genre["sub_genre"];
            })

            movie = movie.map(movie => {
                return Object.assign(movie, { sub_genre: sub_genremap[movie.sub_genre] })
            })
            res.render('index', { data: movie, sub_genre: sub_genre });                  //Render index.hbs file and send data back as rows
        })

    })
});

// app.get('/', function (req, res) {
//     res.render('index');
// });

// app.get('/requested_Movies_available', async (request, response, next) => {
//     try {

//     }
//     catch (error) {
//         response.status(500).send(error.message)
//         window.alert("Error Occurred")
//     }
// });

// app.get('', () => {
//     try {

//     }
//     catch (error) {
//         response.status(500).send(error.message)
//         window.alert("Error Occurred")
//     }
// });

// app.post('/addMembersHasMoviesForm', function (req, res) {
//     //capture data and parse into JS object, can't have NULL values
//     // for Members_Has_Movies add
//     let mhmData = req.body;

//     //Create query and run it on the database
//     mhmQueryInsert = `INSERT INTO Members_has_Movies(member_ID, movie_id) VALUES('${data['member_ID_Input']}', '${data['movie_ID_Input']}'`;
//     db.pool.query(mhmQueryInsert, function (error, rows, fields) {
//         if (error) {
//             console.log(error)
//             res.sendStatus(400);
//         }
//         else {
//             res.redirect('/');
//         }
//     })



app.delete('/delete-movie-ajax/', function (req, res, next) {
    let data = req.body;
    let movieID = parseInt(data.id);
    let deleteMembers_Has_Movies = 'DELETE FROM Members_Has_Movies WHERE movie_ID = ?';
    let delete_Movies = 'DELETE FROM Movies WHERE movie_ID = ?';

    db.pool.query(deleteMembers_Has_Movies, [movieID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            db.pool.query(deleteMovies, [movieID], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
});

// Listener section- makes server work
// Note: Don't add or change anything below this line.
app.listen(PORT, () => {
    console.log(`Server is working for Hunter & Samantha ${PORT}...`);
});