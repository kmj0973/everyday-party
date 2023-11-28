const bcrypt = require("bcryptjs");

/**
 * bcrypt를 통해 비밀번호를 해쉬 값으로 변경
 *
 * @param password {String} 암호화되지 않은 비밀번호
 * @return {String} 암호화된 비밀번호 값
 */
async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}

/**
 * bcrypt를 통해 비밀번호를 해쉬 값으로 변경
 *
 * @param password {String} 암호화되지 않은 비밀번호
 * @param savedPassword {String} 암호화되어 DB에 저장된 비밀번호
 * @return {boolean} 비밀번호 값의 일치 여부
 */
async function comparePassword(password, savedPassword) {
    const isSamePassword = await bcrypt.compare(password, savedPassword);
    return isSamePassword;
}

module.exports = {
    hashPassword,
    comparePassword,
};
