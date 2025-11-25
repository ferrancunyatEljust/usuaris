import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { getAllUsers, createUser, findUserByName } from '../models/userModel.js'

const secretKey = process.env.JWT_SECRET || 'secretkey'

export async function getUsers(req, res, next) {
    try {
        const users = await getAllUsers()
        return res.status(200).json(users)
    } catch (err) {
        next(err)
    }
}

export async function addUser(req, res, next) {
    try {
        const { name, password, role = 'user' } = req.body

        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)

        const result = await createUser({ name, password: hashedPassword, role })
        return res.status(200).json(result)
    } catch (err) {
        next(err)
    }
}

export async function login(req, res, next) {
    try {
        const { username, password } = req.body
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' })
        }

        const user = await findUserByName(username)
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' })
        }

        const passwordMatched = await bcrypt.compare(password, user.password)
        if (!passwordMatched) {
            return res.status(401).json({ message: 'Authentication failed' })
        }

        const payload = { username, role: user.role }
        const token = jwt.sign(payload, secretKey, { expiresIn: '5m' })

        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 5 * 60 * 1000,
        })

        return res.status(200).json({ message: 'Authentication successful' })
    } catch (err) {
        next(err)
    }
}
