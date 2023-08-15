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

PORT = 23400;

var db = require('./database/database_connector');

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');
app.engine('.hbs', engine({ extname: ".hbs" }));
app.set('view engine', '.hbs');



// Route section - contains paths server will respond to Testing
// app.get('/', function (req, res) {
//     res.send("The server is running for Hunter & Samantha!")
// });
//Home Page  
app.get('/', (request, response) => {
    response.render('index');
});


//Member Routes
app.get('/Members', function (req, res) {
    // Declare Query 1
    let query1 = "SELECT member_ID, name AS Name, email AS Email, address AS Address, months_a_member AS Months_a_Member FROM Members;";

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


app.put('/put-email-ajax', async (req, res, next) => {
    let data = req.body;

    let name = parseInt(data.mySelect);
    let email = data.input_email_update;

    queryUpdateEmail = `UPDATE Members SET email = ? WHERE member_id = ?`;

    // Run the 1st query
    db.pool.query(queryUpdateEmail, [email, name], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
    })
});


//Movie Routes
app.get('/Movies', function (req, res) {
    let query1 = "SELECT movie_ID, movie_name AS Title, age_rating AS Age_Rating, release_year AS Year, imdb_rating AS IMDB_Rating, rotten_rating AS Rotten_Tomatoes_Rating, num_times_rented, sub_genre_ID AS Sub_Genre FROM Movies;";
    let query2 = "SELECT * FROM Sub_Genres;";

    db.pool.query(query1, function (error, rows, fields) {

        let movies = rows;

        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {
            let sub_genres = rows;

            let sub_genre_map = {}
            sub_genres.forEach(Sub_Genre => {
                sub_genre_map[Sub_Genre.sub_genre_ID] = Sub_Genre.sub_genre;
                //let id = parseInt(sub_genre.sub_genre_ID, 10);
                //sub_genre_map[id] = sub_genre.sub_genre;
                //console.info(sub_genre_map)
            })

            movies = movies.map(movie => {
                return Object.assign(movie, { Sub_Genre: sub_genre_map[movie.Sub_Genre] });
            });

            return res.render('Movies', { data: movies, sub_genres: sub_genres });
        })
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

app.put('/put-movie-ajax', async (req, res) => {
    let data = req.body

    let movie = parseInt(data.movie_ID)
    let sub_genre = parseInt(data.sub_genre_ID)

    if (isNaN(sub_genre) || isNaN(movie)) {
        res.status(400).send("Invalid sub_genre or movie_ID");
        return;
    }
    // queryUpdateMovie = "UPDATE Movies SET movie_name = :movie_nameInput, sub_genre = :sub_genreInput WHERE movie_ID = :movie_ID_Input;";
    queryUpdateMovie = "UPDATE Movies SET sub_genre_ID = ? WHERE movie_ID = ?;";
    // selectGenre = "SELECT * FROM sub_genre_ID WHERE sub_genre_ID = ?;";

    db.pool.query(queryUpdateMovie, [sub_genre, movie], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
    })
});

//Sub-Genre Routes
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

app.post('/add-sub_genre-form', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;


    query1 = `INSERT INTO Sub_Genres (sub_genre) VALUES ('${data['input_sub_genre']}')`;
    db.pool.query(query1, function (error, rows, fields) {

        if (error) {

            console.log(error)
            res.sendStatus(400);
        }

        else {
            res.redirect('/Sub_Genres');
        }
    })
})


//Award Routes
app.get('/Awards', function (req, res) {
    // Declare Query 1
    let query1 = "SELECT award_ID, award AS Award, ceremony AS Ceremony FROM Awards;";

    // Run the 1st query
    db.pool.query(query1, function (error, rows, fields) {

        let awards = rows;
        return res.render('Awards', { data: awards });
    })
});


app.post('/add-award-form', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;


    query1 = `INSERT INTO Awards (award, ceremony) VALUES ('${data['input_award']}', '${data['input_ceremony']}')`;
    db.pool.query(query1, function (error, rows, fields) {

        if (error) {

            console.log(error)
            res.sendStatus(400);
        }

        else {
            res.redirect('/Awards');
        }
    })
})


//Members_Has_Movies Routes
app.get('/Members_Has_Movies', function (req, res) {
    // Declare Query 1
    let query1 = "SELECT member_ID AS Member, movie_ID AS Movie, overdue AS Overdue, returned AS Returned, checked_out AS Checked_Out_Date, return_date AS Returned_Date FROM Members_has_Movies;";
    let query2 = "SELECT * FROM Members;";
    let query3 = "SELECT * FROM Movies;";

    // Run the 1st query
    db.pool.query(query1, function (error, rows, fields) {
        // Save the customers
        let members_movies = rows;

        db.pool.query(query2, function (error, rows, fields) {

            let members = rows;
            let members_map = {}
            members.forEach(Member => {
                members_map[Member.member_ID] = Member.name;
            })

            db.pool.query(query3, (error, rows, fields) => {

                let movies = rows;
                let movies_map = {}
                movies.forEach(Movie => {
                    movies_map[Movie.movie_ID] = Movie.movie_name;
                })

                members_movies = members_movies.map(hasMovie => {
                    return Object.assign(hasMovie, {
                        Member: members_map[hasMovie.Member],
                        Movie: movies_map[hasMovie.Movie]
                    });
                })

                return res.render('Members_Has_Movies',
                    {
                        members_movies: members_movies,
                        members: members,
                        movies: movies
                    });
            })
        })
    })
});


app.post('/add-movie-rental-form', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let member_ID = parseInt(data.input_name);
    let movie_ID = parseInt(data.input_movie);


    query1 = `INSERT INTO Members_has_Movies (member_ID, movie_ID, checked_out) VALUES (${member_ID}, ${movie_ID}, NOW())`;
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
            res.redirect('/Members_Has_Movies');
        }
    })
})


//Movies_Has_Awards Routes
app.get('/Movies_Has_Awards', function (req, res) {
    // Declare Query 1
    query1 = "SELECT movie_ID AS Movie, award_ID AS Award FROM Movies_has_Awards;";
    query2 = "SELECT * FROM Movies;";
    query3 = "SELECT * FROM Awards;";

    // Run the 1st query
    db.pool.query(query1, function (error, rows, fields) {
        // Save the customers
        let movies_awards = rows;

        db.pool.query(query2, function (error, rows, fields) {

            let movies = rows;
            let movies_map = {}
            movies.forEach(Movie => {
                movies_map[Movie.movie_ID] = Movie.movie_name;
            })

            // let movie_id = rows;
            // let movies_id_map = {}
            // movies.forEach(Movie_ID => {
            //     movies_id_map[Movie_ID.movie_ID] = Movie_ID.movie_ID;
            // })

            db.pool.query(query3, (error, rows, fields) => {

                let awards = rows;
                let awards_map = {}
                awards.forEach(Award => {
                    awards_map[Award.award_ID] = Award.award;
                })

                movies_awards = movies_awards.map(hasAward => {
                    return Object.assign(hasAward, {
                        Movie: movies_map[hasAward.Movie],
                        Award: awards_map[hasAward.Award],
                        // Movie_ID: movies_id_map[hasAward.Movie_ID]
                    })
                })

                return res.render('Movies_Has_Awards',
                    {
                        movies_awards: movies_awards,
                        movies: movies,
                        awards: awards,
                        // movie_id: movie_id
                    });
            })
        })
    })
});


app.post('/add-movie-award-form', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let movie_ID = parseInt(data.input_movie);
    let award_ID = parseInt(data.input_award);


    query1 = `INSERT INTO Movies_has_Awards (movie_ID, award_ID) VALUES (${movie_ID}, ${award_ID})`;
    db.pool.query(query1, function (error, rows, fields) {

        if (error) {

            console.log(error)
            res.sendStatus(400);
        }

        else {
            res.redirect('/Movies_Has_Awards');
        }
    })
})

app.put('/put-movie_awards-ajax', async (req, res) => {
    let data = req.body
    let award_ID = parseInt(data.award_ID)
    let movie = parseInt(data.movie_ID)

    if (isNaN(movie) || isNaN(award_ID)) {
        res.status(400).send("Invalid sub_genre or movie_ID");
        return;
    }
    // queryUpdateMovie = "UPDATE Movies SET movie_name = :movie_nameInput, sub_genre = :sub_genreInput WHERE movie_ID = :movie_ID_Input;";
    queryUpdateMovieAward = "UPDATE Movies_has_Awards SET award_ID = ? WHERE movie_ = ?;";
    // selectGenre = "SELECT * FROM sub_genre_ID WHERE sub_genre_ID = ?;";

    db.pool.query(queryUpdateMovieAward, [award_ID, movie], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
    })
});

//Sub-Genre Routes
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


//Members_Fave_Sub_Genres Routes
app.get('/Members_Fave_Sub_Genres', function (req, res) {
    // Declare Query 1, Query 2 and Query 3
    query1 = "SELECT member_ID AS Member, sub_genre_ID AS Sub_Genre FROM Members_fave_Sub_Genres;";
    query2 = "SELECT * FROM Members;";
    query3 = "SELECT * FROM Sub_Genres;";

    // Run the 1st query
    db.pool.query(query1, function (error, rows, fields) {
        // Save the customers
        let fave_genres = rows;

        db.pool.query(query2, function (error, rows, fields) {

            let members = rows;
            let members_map = {}
            members.forEach(Member => {
                members_map[Member.member_ID] = Member.name;
            })

            db.pool.query(query3, (error, rows, fields) => {

                let sub_genres = rows;
                let sub_genres_map = {}
                sub_genres.forEach(Sub_Genre => {
                    sub_genres_map[Sub_Genre.sub_genre_ID] = Sub_Genre.sub_genre;
                })

                fave_genres = fave_genres.map(faveGenre => {
                    return Object.assign(faveGenre, {
                        Member: members_map[faveGenre.Member],
                        Sub_Genre: sub_genres_map[faveGenre.Sub_Genre]
                    });
                })

                return res.render('Members_Fave_Sub_Genres',
                    {
                        fave_genres: fave_genres,
                        members: members,
                        sub_genres: sub_genres
                    });
            })
        })
    })
});


app.post('/add-member-fave-form', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let member_ID = parseInt(data.input_name);
    let sub_genre_ID = parseInt(data.input_sub_genre);


    query1 = `INSERT INTO Members_fave_Sub_Genres (member_ID, sub_genre_ID) VALUES (${member_ID}, ${sub_genre_ID})`;
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
            res.redirect('/Members_Fave_Sub_Genres');
        }
    })
})

// Listener section- makes server work
// Note: Don't add or change anything below this line.
app.listen(PORT, () => {
    console.log(`Server is working for Hunter & Samantha ${PORT}...`);
});