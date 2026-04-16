const jwt = require('jsonwebtoken')
require('dotenv').config()

const verifyToken = (req, res, next) => {
    const SESS_SECRET = process.env.SESS_SECRET
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    console.log(authHeader)

    if (!token) {
        return res.status(401).json({message: 'Unautherized'})
    }

    try {
        const decoded = jwt.verify(token, SESS_SECRET)
        console.log(decoded)
        req.user = decoded
        next ()
    } catch (error) {
        return res.status(403).json({message: 'Tidak ada akses'})
    }
}

const allowRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({message: 'anda tidak memilki akses'})
        }
        next ()
    }
}

module.exports = {verifyToken, allowRole}