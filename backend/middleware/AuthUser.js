const { sql, poolPromise } = require('../config/db.js');

exports.verifyUser = async (req, res, next) => {
    if (!req.session.userId)
        return res.status(401).json({ msg: 'Mohon login ke akun Anda!' });

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('uuid', sql.NVarChar, req.session.userId)
            .query('SELECT id, uuid, name, email, role FROM users WHERE uuid = @uuid');

        if (result.recordset.length === 0)
            return res.status(404).json({ msg: 'User tidak ditemukan' });

        const user = result.recordset[0];
        req.userId = user.id;
        req.userRole = user.role;
        next();

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.adminOnly = (req, res, next) => {
    if (req.userRole !== 'admin')
        return res.status(403).json({ msg: 'Akses ditolak, hanya admin' });
    next();
};