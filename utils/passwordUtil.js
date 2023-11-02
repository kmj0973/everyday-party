const bcrypt = require("bcryptjs");

async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

async function comparePassword(password, savedPassword) {
    return await bcrypt.compare(password, savedPassword);
}

module.exports = {
    hashPassword,
    comparePassword,
};
