import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();


const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    database: process.env.DB_NAME || 'users',
    password: process.env.DB_USER_PASSWORD || 'root',
    port: process.env.DB_PORT || 3306
});

export default connection