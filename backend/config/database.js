const sql = require ('mysql2/promise')

const db = sql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'latihan'
});

module.exports = db