var mysql = require('mysql')

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs340_goodroem',
    password: '2807',
    database: "cs340_goodroem"

})

module.exports.pool = pool;

