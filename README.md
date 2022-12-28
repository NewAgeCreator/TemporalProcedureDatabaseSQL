# TemporalProcedureDatabaseSQL
Bitemporal Database procedures, which can help saving all states of data, with activitie timestamps.


To use software properly you should need to do this steps first. 

1. TYPE in Terminal ✍🏻 
npm i 

2. CREATE connection pool in config/db.js with MariaDB 💽

const mysql = require('mysql2');

"
var connection = mysql.createPool({
   host: 'HOST_NAME',
   port: PORT,
   user: 'DB_USERNAME',
   password: 'DB_PASSWORD',
   database: 'DATABASE'
});
"

3. DONT'T FORGET TO EXPORT CONNECTION 
module.exports = connection;

I hope u will injoy this part of software. 

Desc. #0.1 Beta Version 



