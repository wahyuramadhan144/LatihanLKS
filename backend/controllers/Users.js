const User = require('../models/UserModels.js');
const argon2 = require('argon2');

exports.getUsers = async (req, res) => {
    try {
        const response = await User.findAll();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

exports.getUsersById = async (req, res) => {
    try {
        const response = await User.findOne({
            where: {
                id: req.params.id
            }
        })
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

exports.createUsers = async (req, res) => {
    const { name, email, password, confPassword, role } = req.body;
    if (password !== confPassword) return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" });
    const hashPassword = await argon2.hash(password);
    try {
        await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        });
        res.status(201).json({ msg: "Register Berhasil" });
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ msg: error.message });
        
    }
}

exports.updateUsers = async (req, res) => {
    const user = await User.findOne({
            where: {
                id: req.params.id
            }
        })
        if(!user) return res.status(404).json({ msg: "User tidak ditemukan" });
        const { name, email, password, confPassword, role } = req.body;
        let hashPassword;
        if(password === "" || password === null) {
            hashPassword = user.password;
        } else {
            hashPassword = await argon2.hash(password);
        }
        await user.update({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        });
        res.status(200).json({ msg: "User berhasil diupdate" });
}

exports.deleteUsers = async (req, res) => {
    const user = await User.findOne({
        where: {
            id: req.params.id
        }
    });
    if(!user) return res.status(404).json({ msg: "User tidak ditemukan" });
    try {
        await User.destroy({
            where: {
                id: user.id
            }
        });
        res.status(200).json({ msg: "User berhasil dihapus" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}