const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const UserRoutes = require('./routes/UserRoutes.js');
const ProductRoutes = require('./routes/ProductRoutes.js');
const session = require('express-session');
const AuthRoutes = require('./routes/AuthRoutes.js');
// const db = require('./config/database.js');
dotenv.config();

const app = express();
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5000'
}))

console.log(process.env.SESS_SECRET);
app.use(session({
    secret : process.env.SESS_SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        secure : "auto",
    }
}))

app.use(express.json());
app.use(UserRoutes);
app.use(ProductRoutes);
app.use(AuthRoutes);


// (async () => {
//     await db.sync();
// })();


app.get('/items', (req, res) => {
    const query = 'SELECT * FROM items';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({error: err.message});
        }
        res.json(results);
    });
});

app.post('/items', (req, res) => {
    const { nama } = req.body;
    db.query('INSERT INTO items (nama) VALUES (?)', [nama], (err, results) => {
        if (err) {
            return res.status(500).json({error: err.message});
        }
        res.status(201).json({id: results.insertId, nama});
    });
});

app.put('/items/:id', (req, res) => {
    const { nama } = req.body;
    const { id } = req.params;
    db.query('UPDATE items SET nama = ? WHERE id = ?', [nama, id], (err) => {
        if (err) return res.status(500).json({error: err.message});
        res.json({ status: 'Updated' });
    })
})

app.delete('/items/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM items WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({error: err.message});
        res.json({ status: 'Deleted' });
    });
})

app.listen(process.env.APP_PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.APP_PORT}`);
});