import connection from '../db/db.js'

export async function getAllUsers() {
    const [results] = await connection.query('SELECT name, role FROM users');
    return results;
}

export async function createUser({ name, password, role }) {
    const [results] = await connection.query(
        'INSERT INTO users(name, password, role) VALUES(?, ?, ?)',
        [name, password, role]
    );
    return results;
}

export async function findUserByName(name) {
    const [results] = await connection.query(
        'SELECT password, role FROM users WHERE name = ?',
        [name]
    );
    return results[0];
}
