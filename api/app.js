import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import connection from './db.js'
import cookieParser from 'cookie-parser'

const secretKey = process.env.JWT_SECRET || 'secretkey'

const app = express()
const port = 3000

app.use(express.json())
app.use(cookieParser())

const verifyToken = async (req, res, next) => {
    try {
        // Extracció del token des de l'encapçalament Authorization
        // const header = req.header("Authorization")
        // const token = header.split(" ")[1]

        // Extracció del token des de la cookie
        const token = req.cookies['auth_token']
        if (!token) {
            return res.status(401).json({ message: "Token not provied" })
        } else {
            try {
                const payload = jwt.verify(token, secretKey)
                req.username = payload.username
                req.role = payload.role
                next()
            } catch (error) {
                return res.status(403).json({ message: "Token not valid" })
            }
        }
    } catch (err) {
        errorHandler(err)
    }
}

const requireAdminRole = (req, res, next) => {
    try {
        if (req.role !== 'admin') {
            return res.status(403).json({ message: "Admin role required" })
        }
        next()
    } catch (err) {
        errorHandler(err)
    }
}

app.get('/users', verifyToken, requireAdminRole, async (req, res) => {
    try {
        const [results] = await connection.query(
            'SELECT name, role FROM users'
        );
        res.status(200).json(results)
    } catch (err) {
        errorHandler(err)
    }
})

app.post('/users', async (req, res) => {
    try {
        const { name, password, role = 'user' } = req.body


        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const [results] = await connection.query(
            'INSERT INTO users(name, password, role) VALUES(?, ?, ?)',
            [name, hashedPassword, role]
        );
        return res.status(200).json(results)
    } catch (err) {
        errorHandler(err)
    }
})



app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        } else {
            const [results] = await connection.query(
                'SELECT password, role FROM users WHERE name = ?',
                [username]
            )

            const passwordMatched = await bcrypt.compare(password, results[0].password);

            if (passwordMatched) {
                const payload = {
                    "username": username,
                    "role": results[0].role
                }
                const token = jwt.sign(payload, secretKey, { expiresIn: "5m" }); // https://github.com/vercel/ms
                res.cookie('auth_token', token, {
                    httpOnly: true,  // Evita l'accés via JavaScript
                    secure: process.env.NODE_ENV === 'production', // Activa en entorns segurs (https)
                    sameSite: 'Strict', // Protegeix contra CSRF
                    maxAge: 5 * 60 * 1000 // Expiració de 5 minuts
                });

                return res.status(200).json({ message: "Authentication successful"});
            } else {
                return res.status(401).json({ message: "Authentication failed" });
            }
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.post('/logout', (req, res) => {
    res.clearCookie('auth_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
    })
    return res.status(200).json({ message: 'Logout correcte' })
})

const errorHandler = (err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send(`Error al servidor:\n ${err}`)
}

app.listen(port, () => {
    console.log(`http://localhost:${port}${'/users'}`)
})
