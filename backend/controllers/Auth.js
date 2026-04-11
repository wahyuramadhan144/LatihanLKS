const { sql, poolPromise } = require('../config/db.js');
const argon2 = require('argon2');

exports.login = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('email', sql.NVarChar, req.body.email)
            .query('SELECT * FROM users WHERE email = @email');

        if (result.recordset.length === 0)
            return res.status(404).json({ msg: 'User tidak ditemukan' });

        const user = result.recordset[0];

        const match = await argon2.verify(user.password, req.body.password);
        if (!match) return res.status(400).json({ msg: 'Password salah' });

        req.session.userId = user.uuid;
        const { uuid, name, email, role } = user;
        res.status(200).json({ uuid, name, email, role });

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.Me = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('uuid', sql.NVarChar, req.session.userId)
            .query('SELECT uuid, name, email, role FROM users WHERE uuid = @uuid');

        if (result.recordset.length === 0)
            return res.status(404).json({ msg: 'User tidak ditemukan' });

        res.status(200).json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(400).json({ msg: 'Tidak dapat logout' });
        res.status(200).json({ msg: 'Logout berhasil' });
    });
};