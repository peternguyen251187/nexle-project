require('dotenv/config');

const { logger } = require('./logger');

const DB_HOST= '178.128.109.9';
const DB_USER= 'test01';
const DB_PASS= 'PlsDoNotShareThePass123@';
const DB_NAME = 'entrance_test'
const JWT_SECRET_KEY = 'jwtsecret';

module.exports = {
    DB_HOST,
    DB_USER,
    DB_PASS,
    DB_NAME,
    JWT_SECRET_KEY
};
