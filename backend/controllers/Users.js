const { sql, poolPromise } = require('../config/db.js');
const argon2 = require('argon2');

exports.getUsers = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM users');
        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.getUsersById = async (req, res) => {
    try {
        const pool = await poolPromise;
        const isUuid = isNaN(req.params.id);

        const result = await pool.request()
            .input('param', sql.NVarChar, req.params.id)
            .query(
                isUuid
                    ? 'SELECT * FROM users WHERE uuid = @param'
                    : 'SELECT * FROM users WHERE id = @param'
            );

        if (result.recordset.length === 0)
            return res.status(404).json({ msg: 'User tidak ditemukan' });

        res.status(200).json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.createUsers = async (req, res) => {
    const { name, email, password, confPassword, role } = req.body;
    if (password !== confPassword)
        return res.status(400).json({ msg: 'Password dan Confirm Password tidak cocok' });

    try {
        const hashPassword = await argon2.hash(password);
        const pool = await poolPromise;

        await pool.request()
            .input('uuid', sql.NVarChar, require('crypto').randomUUID())
            .input('name', sql.NVarChar, name)
            .input('email', sql.NVarChar, email)
            .input('password', sql.NVarChar, hashPassword)
            .input('role', sql.NVarChar, role)
            .query('INSERT INTO users (uuid, name, email, password, role) VALUES (@uuid, @name, @email, @password, @role)');

        res.status(201).json({ msg: 'Register Berhasil' });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

exports.updateUsers = async (req, res) => {
    try {
        const pool = await poolPromise;
        const check = await pool.request()
            .input('uuid', sql.NVarChar, req.params.id)
            .query('SELECT * FROM users WHERE uuid = @uuid');

        if (check.recordset.length === 0)
            return res.status(404).json({ msg: 'User tidak ditemukan' });

        const user = check.recordset[0];
        const { name, email, password, confPassword, role } = req.body;

        let hashPassword;
        if (!password || password === '') {
            hashPassword = user.password;
        } else {
            hashPassword = await argon2.hash(password);
        }

        await pool.request()
            .input('uuid', sql.NVarChar, req.params.id)
            .input('name', sql.NVarChar, name)
            .input('email', sql.NVarChar, email)
            .input('password', sql.NVarChar, hashPassword)
            .input('role', sql.NVarChar, role)
            .query('UPDATE users SET name=@name, email=@email, password=@password, role=@role WHERE uuid=@uuid');

        res.status(200).json({ msg: 'User berhasil diupdate' });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.deleteUsers = async (req, res) => {
    try {
        const pool = await poolPromise;
        const check = await pool.request()
            .input('uuid', sql.NVarChar, req.params.id)
            .query('SELECT * FROM users WHERE uuid = @uuid');

        if (check.recordset.length === 0)
            return res.status(404).json({ msg: 'User tidak ditemukan' });

        await pool.request()
            .input('uuid', sql.NVarChar, req.params.id)
            .query('DELETE FROM users WHERE uuid = @uuid');

        res.status(200).json({ msg: 'User berhasil dihapus' });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};