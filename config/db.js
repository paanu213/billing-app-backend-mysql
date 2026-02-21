const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'adminuser1',
    password: 'Billing@2026',
    database: 'billingsoftdb',
    waitForConnections: 'true',
    connectionLimit: 10
});

module.exports = pool;