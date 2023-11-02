const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();

function setUserToken(user) {
    const { userId } = user;
    const token = jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: "5m" });
    return token;
}

function verifyToken(token) {
    const isValidToken = jwt.verify(token, process.env.SECRET_KEY);
    return isValidToken;
}

module.exports = {
    setUserToken,
    verifyToken,
};
