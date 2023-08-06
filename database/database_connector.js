var mysql = require('mysql')

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs340_affarans',
    password: '1043',
    database: "cs340_affarans"

})

module.exports.pool = pool;

//password: "Tacoma26711211!",