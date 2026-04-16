const { sql, poolPromise } = require('../config/db.js');

exports.getProducts = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
                SELECT 
                    p.id, p.uuid, p.name, p.price, p.role,
                    u.name AS userName, u.email AS userEmail+
                FROM products p
                INNER JOIN users u ON p.userId = u.id
            `);
        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.getProductsById = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query(`
                SELECT 
                    p.id, p.uuid, p.name, p.price, p.role,
                    u.name AS userName, u.email AS userEmail
                FROM products p
                INNER JOIN users u ON p.userId = u.id
                WHERE p.id = @id
            `);

        if (result.recordset.length === 0)
            return res.status(404).json({ msg: 'Product tidak ditemukan' });

        res.status(200).json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.createProducts = async (req, res) => {
    const { name, price, role } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('uuid', sql.NVarChar, require('crypto').randomUUID())
            .input('name', sql.NVarChar, name)
            .input('price', sql.Int, price)
            .input('role', sql.NVarChar, role)
            .input('userId', sql.Int, req.userId) // dari middleware verifyUser
            .query(`
                INSERT INTO products (uuid, name, price, role, userId)
                VALUES (@uuid, @name, @price, @role, @userId)
            `);
        res.status(201).json({ msg: 'Product berhasil dibuat' });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

exports.updateProducts = async (req, res) => {
    try {
        const pool = await poolPromise;
        const check = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('SELECT * FROM products WHERE id = @id');

        if (check.recordset.length === 0)
            return res.status(404).json({ msg: 'Product tidak ditemukan' });

        const { name, price, role } = req.body;
        await pool.request()
            .input('id', sql.Int, req.params.id)
            .input('name', sql.NVarChar, name)
            .input('price', sql.Int, price)
            .input('role', sql.NVarChar, role)
            .query(`
                UPDATE products 
                SET name=@name, price=@price, role=@role 
                WHERE id=@id
            `);
        res.status(200).json({ msg: 'Product berhasil diupdate' });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.deleteProducts = async (req, res) => {
    try {
        const pool = await poolPromise;
        const check = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('SELECT * FROM products WHERE id = @id');

        if (check.recordset.length === 0)
            return res.status(404).json({ msg: 'Product tidak ditemukan' });

        await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('DELETE FROM products WHERE id = @id');

        res.status(200).json({ msg: 'Product berhasil dihapus' });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};