//Code for connecting the database
//Copied from/ modified from the nodejs-start-app
//from osu-cs340-campus git account- Step 1 - Connecting to a MySQL Database
//Date: 8/14/2023
//URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step 8 - Dynamically Updating Data

var mysql = require('mysql')

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs340_goodroem',
    password: '2807',
    database: "cs340_goodroem"
})

module.exports.pool = pool;

