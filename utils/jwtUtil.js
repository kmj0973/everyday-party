const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

/**
 * 유저 정보 값을 받아 토큰 값을 반환
 *
 * @param user {User} 토큰 발행을 원하는 User 객체
 * @return {String} JWT 토큰 값
 */
function createUserToken(user) {
    const { userId, grade } = user;
    const token = jwt.sign({ userId, grade }, process.env.SECRET_KEY, { expiresIn: "25m" });
    return token;
}

/**
 * 토큰 값과 secret key를 통해 해당 토큰의 유효성을 검증
 *
 * @param token {String} 검증하고자하는 토큰 값
 * @return {Jwt} decode된 토큰 값
 */
function verifyToken(token) {
    return jwt.verify(token, process.env.SECRET_KEY);
}

module.exports = {
    createUserToken,
    verifyToken,
};
