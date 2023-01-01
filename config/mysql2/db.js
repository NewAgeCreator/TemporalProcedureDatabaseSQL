const mysql = require('mysql2');

var connection = mysql.createPool({
   host: 'mariadb106.server821368.nazwa.pl',
   port: 3306,
   user: 'server821368_testowabaza',
   password: 'Root1234',
   database: 'server821368_testowabaza'
});

module.exports = connection;