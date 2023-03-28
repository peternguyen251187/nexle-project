const User = require('../models/user.model');
const Token = require('../models/token.model');
const { hash: hashPassword, compare: comparePassword } = require('../utils/password');
const { generateToken, generateRefershToken } = require('../utils/token');

exports.signup = (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = hashPassword(password.trim());

    const user = new User(firstName.trim(), lastName.trim(), email.trim(), hashedPassword);

    User.create(user, (err, data) => {
        if (err) {
            res.status(500).send({
                status: "error",
                message: err.message
            });
        } else {
            res.status(201).send({
                status: "success",
                data: {
                    data
                }
            });
        }
    });
};

exports.signin = (req, res) => {
    const { email, password } = req.body;
    User.findByEmail(email.trim(), (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    status: 'error',
                    message: `User with email ${email} was not found`
                });
            }
            res.status(500).send({
                status: 'error',
                message: err.message
            });
        }
        if (data) {
            if (comparePassword(password.trim(), data.password)) {
                console.log("data>>>>", data)
                const token = generateToken(data.id);
                const refreshToken = generateRefershToken(data.id);
                const expireIns = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000));
                const newToken = new Token(data.id, refreshToken, expireIns);
                Token.create(newToken, (err, dataToken) => {
                    if (err) {
                        res.status(500).send({
                            status: "error",
                            message: err.message
                        });
                    } else {
                        res.status(200).send({
                            status: 'success',
                            user: {
                                firstName: data.firstName,
                                lastName: data.lastName,
                                email: data.email,
                                displayName: data.firstName + data.lastName
                            },
                            token,
                            refreshToken,
                        });
                    }
                });
            } else {
                res.status(401).send({
                    status: 'error',
                    message: 'Incorrect password'
                });
            }
        }
    });

}

exports.signout = (req, res) => {
    Token.signout((err, data) => {
        if (err) {
            res.status(500).send({
                status: "error",
                message: err.message
            });
        } else {
            res.status(204).send({
                status: "success"
            });
        }
    });
};

exports.refreshtoken = (req, res) => {
    const { refreshToken } = req.body;
    Token.findByRefreshToken(refreshToken, (err, data) => {
        if (err) {
            res.status(500).send({
                status: "error",
                message: err.message
            });
        } else {
            if (data) {
                const token = generateToken(data.userId);
                const newRefreshToken = generateRefershToken(data.userId);
                const expireIns = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000));
                const newToken = new Token(data.userId, newRefreshToken, expireIns);
                Token.create(newToken, (err) => {
                    if (err) {
                        res.status(500).send({
                            status: "error",
                            message: err.message
                        });
                    } else {
                        // invalid old refreshtoken
                        Token.destroy(refreshToken, (err) => {
                            if (err) {
                                res.status(500).send({
                                    status: "error",
                                    message: err.message
                                });
                            } else {
                                res.status(200).send({
                                    status: 'success',
                                    token,
                                    refreshToken
                                });
                            }
                        })
                    }
                });
            } else {
                res.status(404).send({
                    status: 'error',
                    message: 'Refreshtoken is not exists.'
                });
            }
        }
    });
};