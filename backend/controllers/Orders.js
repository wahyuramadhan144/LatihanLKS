const { sql, poolPromise } = require('../config/db.js');
const crypto = require('crypto');

exports.createOrder = async (req, res) => {
    const { items } = req.body;

    if (!items || items.length === 0)
        return res.status(400).json({ msg: 'Items tidak boleh kosong' });

    try {
        const pool = await poolPromise;

        let totalPrice = 0;
        const itemsWithPrice = [];

        for (const item of items) {
            const result = await pool.request()
                .input('productId', sql.Int, item.productId)
                .query('SELECT id, name, price FROM products WHERE id = @productId');

            if (result.recordset.length === 0)
                return res.status(404).json({ msg: `Product id ${item.productId} tidak ditemukan` });

            const product = result.recordset[0];
            const subtotal = product.price * item.quantity;
            totalPrice += subtotal;

            itemsWithPrice.push({
                productId: product.id,
                quantity : item.quantity,
                price    : product.price,
                subtotal : subtotal
            });
        }

        const orderResult = await pool.request()
            .input('uuid',       sql.NVarChar, crypto.randomUUID())
            .input('userId',     sql.Int,      req.userId) // dari verifyUser
            .input('totalPrice', sql.Int,      totalPrice)
            .query(`
                INSERT INTO orders (uuid, userId, totalPrice)
                OUTPUT INSERTED.id
                VALUES (@uuid, @userId, @totalPrice)
            `);

        const orderId = orderResult.recordset[0].id;

        for (const item of itemsWithPrice) {
            await pool.request()
                .input('orderId',   sql.Int, orderId)
                .input('productId', sql.Int, item.productId)
                .input('quantity',  sql.Int, item.quantity)
                .input('price',     sql.Int, item.price)
                .input('subtotal',  sql.Int, item.subtotal)
                .query(`
                    INSERT INTO order_items (orderId, productId, quantity, price, subtotal)
                    VALUES (@orderId, @productId, @quanti ty, @price, @subtotal)
                `);
        }

        res.status(201).json({ msg: 'Order berhasil dibuat', orderId });

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('userId', sql.Int, req.userId)
            .query(`
                SELECT 
                    o.id, o.uuid, o.totalPrice, o.createdAt,
                    u.name AS pembeliName, u.email AS pembeliEmail
                FROM orders o
                INNER JOIN users u ON o.userId = u.id
                WHERE o.userId = @userId
                ORDER BY o.createdAt DESC
            `);

        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const pool = await poolPromise;

        const orderResult = await pool.request()
            .input('orderId', sql.Int, req.params.id)
            .query(`
                SELECT 
                    o.id, o.uuid, o.totalPrice, o.createdAt,
                    u.name AS pembeliName, u.email AS pembeliEmail
                FROM orders o
                INNER JOIN users u ON o.userId = u.id
                WHERE o.id = @orderId
            `);

        if (orderResult.recordset.length === 0)
            return res.status(404).json({ msg: 'Order tidak ditemukan' });

        const itemsResult = await pool.request()
            .input('orderId', sql.Int, req.params.id)
            .query(`
                SELECT 
                    p.name  AS namaProduk,
                    oi.price AS hargaSatuan,
                    oi.quantity AS qty,
                    oi.subtotal AS totalPerItem
                FROM order_items oi
                INNER JOIN products p ON oi.productId = p.id
                WHERE oi.orderId = @orderId
            `);

        const order = orderResult.recordset[0];

        res.status(200).json({
            invoice: {
                id         : order.id,
                uuid       : order.uuid,
                tanggal    : order.createdAt,
                kasir      : order.pembeliName,
                email      : order.pembeliEmail,
            },
            items      : itemsResult.recordset,
            grandTotal : order.totalPrice
        });

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
                SELECT 
                    o.id, o.uuid, o.totalPrice, o.createdAt,
                    u.name AS pembeliName, u.email AS pembeliEmail
                FROM orders o
                INNER JOIN users u ON o.userId = u.id
                ORDER BY o.createdAt DESC
            `);

        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};