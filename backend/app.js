const express   = require('express');
const cors      = require('cors');
const dotenv    = require('dotenv');
const session   = require('express-session');
const UserRoutes    = require('./routes/UserRoutes.js');
const ProductRoutes = require('./routes/ProductRoutes.js');
const AuthRoutes    = require('./routes/AuthRoutes.js');
const db = require('./config/database');

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

app.listen(process.env.APP_PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.APP_PORT}`);
});