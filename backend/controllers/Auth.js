const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()

exports.Login = async (req, res) => {
    const SESS_SECRET = process.env.SESS_SECRET

    try {
        //sesuai dengan form login yang diinginkan
        const { email, password } = req.body

        //validasi tidak boleh ada yang kosong baik isi maupun array
        if ( !email || email==="" || !password || password==="" ) {
            return res.status(400).json ({Message: 'Masukkin derr'})
        }

        //periksa email yang dimasukkan oleh user apakah ada di table atau engga
        const [ checkUser ] = await db.query('SELECT * FROM users WHERE email=?', [email])
        // console.log(checkUser)
        

        //jika ada maka data haru lebih dari satu tidak boleh kosong
        if (checkUser.length === 0) {
            return res.status(400).json ({Message: 'Masukkin derr'})
        }

        //menyamakan password yang dimasukkan oleh user apakah sama atau tidak 
        const user = checkUser[0]
        const comparing = await bcrypt.compare(password, user.password)
        if (!comparing) {
            return res.status(400).json ({Message: 'Email atau password salah derr'})
        }

        //membuat token baru
        const token = jwt.sign (
            {id: user.id, role: user.role},
            SESS_SECRET,
            {expiresIn : '1d'}
        )

        res.status(200).json ({ Message: 'Login berhasil derr', token, id: user.id, role: user.role})

    } catch (error) {
        return res.status(500).json ({Message: 'Login gagal derr', error: error.message})
    }
}

exports.register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body
        console.log( name, email, password, confirmPassword )

        //ini untuk cek apakah variable nya udah ada apa blom
        if ( !name || !email || !password || !confirmPassword ){
            return res.status(400).json ({ Message: 'harap isi variable nya'})
        }

        //ini untuk cek nilai harus diisi
        if ( name=="" || email=="" || password=="" || confirmPassword=="" ) {
            return res.status(400).json ({ Message: 'Diisi bang'})
        }

        //periksa email apakah sudah terdaftar atau belum
        const [checkUser] = await db.query('SELECT * from users WHERE email=?', [email])
        console.log(checkUser)

        //checkUser.length itu untuk periksa si data dimulai dari 0 dan jika sudah terdaftar maka nilai nya sudah lebih dari 0 dan itu tandanya email sudah didaftarkan sebelumnya
        if (checkUser.length > 0 ) {
            return res.status(400).json ({ Message: 'email sudah terdaftar'})
        }

        if ( password !== confirmPassword ) {
            return res.status(400).json ({ Message: 'Password tidak sesuai'})
        }

        const salt = await bcrypt.genSalt(5)
        const hashPassword = await bcrypt.hash(password, salt)

        const sql = 'INSERT INTO users (name, email, role, password) VALUES (?, ?, ?, ?)'

        const [result] = await db.query(sql, [name, email, 'admin', hashPassword ])
        return res.status(201).json ({ Message: 'Berhasil terdaftar'})

    } catch ( error ){
        res.status(500).send('Error Debugging')
        console.log(error)
    }
}

exports.registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body

        //ini untuk cek nilai harus diisi 
        if ( name==""|| email=="" || password=="" ) {
            return res.status(400).json ({ Message: 'Diisi bang'})
        }

        const salt = await bcrypt.genSalt(5)
        const hashPassword = await bcrypt(password, salt)

        const sql = 'INSERT INTO users (name, email, role, password) VALUES (?, ?, ?, ?)'

        const [result] = await db.query(sql, [name, email, 'admin', hashPassword ])
        return res.status(201).json ({ Message: 'Berhasil terdaftar menjadi Admin'})

    } catch ( error ){
        res.status(500).send('Error Debugging')
        console.log(error)
    }
}