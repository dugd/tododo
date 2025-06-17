const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function hash(data) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(data, salt);
}

async function verify(data, encoded) {
    return await bcrypt.compare(data, encoded);
}

function jwtSign(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
    });
}

function jwtVerify(token) {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
}

module.exports = { hash, verify, jwtSign, jwtVerify };
