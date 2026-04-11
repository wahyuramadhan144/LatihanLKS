// const sequelize = require('sequelize');
const sql = require('mssql');
require('dotenv').config();

const databaseConfig = {
    user: 'sa',
    password: 'prabowo',
    server: 'localhost\\SQLEXPRESS',
    database: 'dblatihan',
    options: {
        encrypt: true,
        trustServerCertificate: true,
        enableArithAbort: true,
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
    }
};

const poolPromise = new sql.ConnectionPool(databaseConfig)
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL');
        return pool;
    })
    .catch(err => {
        console.error('Database Connection Failed! Bad Config: ', err);
        throw err;
    });

module.exports = { sql, poolPromise };