const db = require ('../config/database');
const bcrypt = require ('bcrypt');

exports.getUsers = async (req, res) => {
    try {
        const sql = 'select * from users'
        const [result] = await db.query (sql)

        if (result.length === 0)
        return res.status(404).json ({ message: 'User tidak ada'});
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json ({ msg: error.message })
        console.error(error)
    }
};

exports.getUsersById = async ( req, res ) => {
    try {
        const sql = 'select * from users where id = ?'
        const [result] = await db.query(sql, [req.params.id])

        if (result.length === 0)
            return res.status(404).json({ msg: 'User tidak ditemukan' });
        res.status(200).json(result[0])
    } catch (error) {
        res.status(500).json({ msg : error.message })
    }
};

exports.createUsers = async ( req, res ) => {

    try {
        const { name, email, password, confPassword, role } = req.body;
        console.log( name, email, role, password, confPassword )

        if ( !name || !email || !role || !password || !confPassword ) {
            return res.status(400).json ({ msg: 'isi semua kolom dulu derr'})
        }

        if ( name==0 || email==0 || role==0 || password==0 || confPassword==0 ){
            return res.status(400).json ({ msg: 'isi semua kolom dulu der'})
        }

        const sql = `insert into users (name, email, role, password, confPassword ) values (?, ?, ?, ?, ?)`
        const [result] = await db.query (sql, [name, email, 'user', password, confPassword])
        res.status(200).json ({ msg: `${result.affectedRows} Berhasil membuat akun `});
    } catch (error) {
        res.status(400).json ({ msg: error.message });
    }
};