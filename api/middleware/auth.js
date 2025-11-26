import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const secretKey = process.env.JWT_SECRET

export const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies && req.cookies['auth_token']
        if (!token) {
            return res.status(401).json({ message: 'Token not provided' })
        }
        try {
            const payload = jwt.verify(token, secretKey)
            req.username = payload.username
            req.role = payload.role
            next()
        } catch (error) {
            return res.status(403).json({ message: 'Token not valid' })
        }
    } catch (err) {
        next(err)
    }
}

export const requireAdminRole = (req, res, next) => {
    try {
        if (req.role !== 'admin') {
            return res.status(403).json({ message: 'Admin role required' })
        }
        next()
    } catch (err) {
        next(err)
    }
}
