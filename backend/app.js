const express   = require('express');
const cors      = require('cors');
const dotenv    = require('dotenv');
const session   = require('express-session');
const UserRoutes    = require('./routes/UserRoutes.js');
const ProductRoutes = require('./routes/ProductRoutes.js');
const AuthRoutes    = require('./routes/AuthRoutes.js');
const { sql, poolPromise } = require('./config/db.js');       // MSSQL
const sequelize             = require('./config/database.js'); // MySQL via Sequelize
const OrderRoutes    = require('./routes/0rderRoutes.js');

dotenv.config();

const app = express();

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5000'
}));

app.use(session({
    secret           : process.env.SESS_SECRET,
    resave           : false,
    saveUninitialized: true,
    cookie           : {
        secure: "auto",
        httpOnly: true,
        sameSite: "lax"
    }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(UserRoutes);
app.use(ProductRoutes);
app.use(AuthRoutes);
app.use(OrderRoutes.router);

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to MySQL');
    } catch (err) {
        console.error('MySQL Connection Failed:', err.message);
    }
})();

app.get('/data', async (req, res) => {
    try {
        const pool   = await poolPromise;
        const result = await pool.request()
            .query('SELECT * FROM Data_Siswa');
        res.json(result.recordset);
    } catch (err) {
        console.error('[MSSQL] Error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.get('/mysql/data', async (req, res) => {
    try {
        const [rows] = await sequelize.query('SELECT * FROM Data_Siswa');
        res.json(rows);
    } catch (err) {
        console.error('[MySQL] Error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.listen(process.env.APP_PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.APP_PORT}`);
});