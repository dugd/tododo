const bcrypt = require('bcrypt');

async function hash(data) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

async function verify(data, encoded) {
    return await bcrypt.compare(data, encoded);
}

module.exports = { hash, verify };
