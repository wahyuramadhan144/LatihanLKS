const db = require('../config/database.js');

exports.getProducts = async (req, res) => {
    try {
        const sql = 'select * from products'
        const [result] = await db.query (sql)

        if (result.length === 0)
        return res.status(404).json({message: ' Produk tidak tersedia '});
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ msg: error.message });
        console.error(error)
    }
};

exports.getProductsById = async (req, res) => {
    try {
        const sql = 'select * from products where id = ?'
        const [result] = await db.query (sql, [req.params.id])

        if (result.length === 0)
            return res.status(404).json({ msg: 'Product tidak ditemukan' });

        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.createProducts = async (req, res) => {
    
    try {
    const { name, price } = req.body;
    console.log( name, price )
    
    if ( !name || name=="" ||!price || price=="" ) {
        return res.status(400).json ({ message: 'Isi semua kolom dulu der'})
    }

    const sql  = `insert into products (name, price) values (?, ?)`
    const [result] = await db.query (sql, [name, price])
    res.status(200).json({ msg: `${result.affectedRows} Produk berhasil dibuat` });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

exports.updateProducts = async (req, res) => {
    try {
        const { id } = req.params
        const { name, price } = req.body
        const [checkData] = await db.query('select * from products where id = ?', [id])

        if (checkData.length == 0) {
            return res.status(400).json ({ message: 'Produk tidak ada'})
        }

        if ( !name || name=="" || !price || price=="" ) {
            return res.status(400).json ({ message: 'Tolong isi semua kolom derr'})
        }

        const sql = `update products set name=?, price=? where id=?`
        const [result] = await db.query (sql, [name, price, id])
        res.status(200).json({ msg: `${result.affectedRows} Produk berhasil diupdate` });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.deleteProducts = async (req, res) => {
    try {
        const { id } = req.params
        const [checkData] = await db.query('select * from products where id = ?', [id])

        if (checkData.length == 0) {
            return res.status(400).json ({ message: 'Produk tidak ada'})
        }

        const sql = `delete from products where id=?`
        const [result] = await db.query (sql, [id])
        res.status(200).json({ msg: `${result.affectedRows} Produk berhasil dihapus` });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};