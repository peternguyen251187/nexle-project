const { DB_NAME } = require('../utils/secrets')

const createDB = `CREATE DATABASE IF NOT EXISTS ${DB_NAME}`;

const dropDB = `DROP DATABASE IF EXISTS ${DB_NAME}`;

const createTableUSers = `
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(50) NULL,
    lastName VARCHAR(50) NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updatedAt TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
)
`;

const createNewUser = `
INSERT INTO users VALUES(null, ?, ?, ?, ?, NOW(), NOW())
`;

const findUserByEmail = `
SELECT * FROM users WHERE email = ?
`;

const createTableTokens = `
CREATE TABLE IF NOT EXISTS tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT,
    refreshToken VARCHAR(250) NULL,
    expiresIn VARCHAR(64) NULL,
    createdAt TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updatedAt TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (userId) REFERENCES users(id)
)
`;

const createNewToken = `
INSERT INTO tokens VALUES(null, ?, ?, ?, NOW(), NOW())
`;

const truncateToken = `TRUNCATE TABLE  tokens;`;

const findByRefreshToken = `
SELECT * FROM tokens WHERE refreshToken = ?
`;

const deleteByRefreshToken = `DELETE FROM tokens WHERE refreshToken = ?;`

module.exports = {
    createDB,
    dropDB,
    createTableUSers,
    createNewUser,
    findUserByEmail,
    createTableTokens,
    createNewToken,
    truncateToken,
    findByRefreshToken,
    deleteByRefreshToken
};
