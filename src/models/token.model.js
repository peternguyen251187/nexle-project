const db = require('../config/db.config');
const { createNewToken: createNewTokenQuery, truncateToken: truncateTokenQuery, findByRefreshToken: findByRefreshTokenQuery, deleteByRefreshToken: deleteByRefreshTokenQuery } = require('../database/queries');
const { logger } = require('../utils/logger');

class Token {
    constructor(userId, refreshToken, expiresIn) {
        this.userId = userId;
        this.refreshToken = refreshToken;
        this.expiresIn = expiresIn;
    }

    static create(newToken, cb) {
        db.query(createNewTokenQuery, 
            [
                newToken.userId, 
                newToken.refreshToken, 
                newToken.expiresIn, 
            ], (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                cb(null, {
                    id: res.insertId,
                    userId: newToken.userId,
                    refreshToken: newToken.refreshToken,
                    expiresIn: newToken.expiresIn
                });
        });
    }

    static findByRefreshToken(refreshToken, cb) {
        db.query(findByRefreshTokenQuery, refreshToken, (err, res) => {
            if (err) {
                logger.error(err.message);
                cb(err, null);
                return;
            }
            if (res.length) {
                cb(null, res[0]);
                return;
            }
            cb({ kind: "not_found" }, null);
        })
    }

    static signout(cb) {
        db.query(truncateTokenQuery, (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                cb(null, {
                });
        });
    }

    static destroy(refreshToken, cb) {
        db.query(deleteByRefreshTokenQuery, refreshToken, (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                cb(null, {
                });
        });
    }
}

module.exports = Token;