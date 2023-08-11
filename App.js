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
app.use(express.static('views'))  //if doesnt work change to views

PORT = 23399;

var db = require('./database/database_connector');

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');
app.engine('.hbs', engine({ extname: ".hbs" }));
app.set('view engine', '.hbs');





// Route section - contains paths server will respond to Testing
// app.get('/', function (req, res) {
//     res.send("The server is running for Hunter & Samantha!")
// });

app.get('/', (request, response) => {
    response.render('index');
});


app.get('/Movies', function (req, res) {
    let query1 = "SELECT * FROM Movies;";
    let query2 = "SELECT * FROM Sub_Genres;";

    db.pool.query(query1, function (error, rows, fields) {

        let movies = rows;

        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {
            let sub_genres = rows;

            let sub_genre_map = {}
            sub_genres.forEach(sub_genre => {
                let id = parseInt(sub_genre.sub_genre_ID, 10);
                sub_genre_map[id] = sub_genre.sub_genre;
                console.info(sub_genre_map)
            })

            // Overwrite the author ID with the name of the author in the book object
            movies = movies.map(movie => {
                return Object.assign(movie, { sub_genre_ID: sub_genre_map[movie.sub_genre_ID] });
            });

            return res.render('Movies', { data: movies, sub_genres: sub_genres });
        })
    })
});

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
    let movie_ID = parseInt(data.id);
    //let deleteMembers_Has_Movies = `DELETE FROM Members_has_Movies WHERE movie_ID = ?`;
    let deleteMovies = `DELETE FROM Movies WHERE movie_ID = ?`;

    // db.pool.query(deleteMembers_Has_Movies, [movie_ID], function (error, rows, fields) {
    //     if (error) {
    //         console.log(error);
    //         res.sendStatus(400);
    //     }
    //     else {
    db.pool.query(deleteMovies, [movie_ID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    })
    // }
    // })
});


app.delete('/delete-member-ajax/', function (req, res, next) {
    let data = req.body;
    let member_ID = parseInt(data.member_ID);
    let deleteMembers_Has_Movies = `DELETE FROM Members_has_Movies WHERE member_ID = ?`;
    let deleteMembers_Fave_Sub_Genres = `DELETE FROM Members_fave_Sub_Genres WHERE member_ID = ?`;
    let deleteMember = `DELETE FROM Members WHERE member_ID = ?`;


    // Run the 1st query
    db.pool.query(deleteMembers_Has_Movies, [member_ID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        else {
            db.pool.query(deleteMembers_Fave_Sub_Genres, [member_ID], function (error, rows, fields) {
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }

                else {

                    // Run the second query
                    db.pool.query(deleteMember, [member_ID], function (error, rows, fields) {

                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.sendStatus(204);
                        }
                    })
                }
            })
        }
    })
});


app.get('/Awards', function (req, res) {
    // Declare Query 1
    query1 = "SELECT * FROM Awards;";

    // Run the 1st query
    db.pool.query(query1, function (error, rows, fields) {
        // Save the customers
        let awards = rows;
        return res.render('Awards', { data: awards });
    })
});

app.get('/Members', function (req, res) {
    // Declare Query 1
    query1 = "SELECT * FROM Members;";

    // Run the 1st query
    db.pool.query(query1, function (error, rows, fields) {
        // Save the customers
        let members = rows;
        return res.render('Members', { data: members });
    })
});

app.post('/add-member-form', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;


    query1 = `INSERT INTO Members (name, email, address) VALUES ('${data['input_name']}', '${data['input_email']}', '${data['input_address']}')`;
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else {
            res.redirect('/Members');
        }
    })
})

app.put('/put-movie-ajax', async (req, res) => {
    let data = req.body

    let movie = parseInt(data.movie_id)
    let sub_genre = parseInt(data.sub_genre_ID)

    if (isNaN(sub_genre) || isNaN(movie)) {
        res.status(400).send("Invalid sub_genre or movie_id.");
        return;
    }
    // queryUpdateMovie = "UPDATE Movies SET movie_name = :movie_nameInput, sub_genre = :sub_genreInput WHERE movie_ID = :movie_ID_Input;";
    queryUpdateMovie = "UPDATE Movies SET sub_genre_ID = ? WHERE movie_id = ?;";
    selectGenre = "SELECT * FROM sub_genre_ID WHERE id = ?;";

    db.pool.query(queryUpdateMovie, [sub_genre, movie], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
    })
});

app.put('/put-email-ajax', async (req, res, next) => {
    let data = req.body;

    let name = parseInt(data.member_ID);
    let email = data.input_email_update;

    queryUpdateEmail = `UPDATE Members SET email = ? WHERE member_id = ?`;

    // Run the 1st query
    db.pool.query(queryUpdateEmail, [name , email], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
    })
});



app.post('/add-movie-form', async (req, res) => {
    try {
        const {
            input_movie_name,
            input_age_rating,
            input_release_year,
            input_imdb,
            input_rotten,
            input_sub_genre

        } = req.body;

        const query = `
            INSERT INTO Movies(movie_name, age_rating,release_year,IMDB_rating, rotten_rating, sub_genre_ID)
            VALUES (?,?,?,?,?,?)
        `;

        const values = [
            input_movie_name,
            input_age_rating,
            input_release_year,
            input_imdb,
            input_rotten,
            input_sub_genre
        ];

        console.log(values)

        db.pool.query(query, values, function (error, rows, fields) {
            let movies = rows;
            return res.render('Movies', { data: movies });
        })

        res.redirect('/Movies')

    } catch (error) {
        console.error(error);
        res.sendStatus(500); // Internal Server Error
    }
});


app.get('/Members_Fave_Sub_Genres', function (req, res) {
    // Declare Query 1
    query1 = "SELECT * FROM Members_fave_Sub_Genres;";

    // Run the 1st query
    db.pool.query(query1, function (error, rows, fields) {
        // Save the customers
        let fave_genres = rows;
        return res.render('Members_Fave_Sub_Genres', { data: fave_genres });
    })
});

app.get('/Members_Has_Movies', function (req, res) {
    // Declare Query 1
    query1 = "SELECT * FROM Members_has_Movies;";

    // Run the 1st query
    db.pool.query(query1, function (error, rows, fields) {
        // Save the customers
        let members_has_movies = rows;
        return res.render('Members_Has_Movies', { data: members_has_movies });
    })
});

app.get('/Movies_Has_Awards', function (req, res) {
    // Declare Query 1
    query1 = "SELECT * FROM Movies_has_Awards;";

    // Run the 1st query
    db.pool.query(query1, function (error, rows, fields) {
        // Save the customers
        let movies_has_awards = rows;
        return res.render('Movies_Has_Awards', { data: movies_has_awards });
    })
});

app.get('/Sub_Genres', function (req, res) {
    // Declare Query 1
    query1 = "SELECT * FROM Sub_Genres;";

    // Run the 1st query
    db.pool.query(query1, function (error, rows, fields) {
        // Save the customers
        let sub_genres = rows;
        return res.render('Sub_Genres', { data: sub_genres });
    })
});

// Listener section- makes server work
// Note: Don't add or change anything below this line.
app.listen(PORT, () => {
    console.log(`Server is working for Hunter & Samantha ${PORT}...`);
});