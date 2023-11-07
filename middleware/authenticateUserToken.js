const jwtUtil = require("../utils/jwtUtil");

async function authenticateUserToken(req, res, next) {
    if (req.header("Authorization") === undefined || req.header("Authorization") === null) {
        const newError = new Error("토큰이 필요합니다.");
        newError.status = 401;
        return next(newError);
    }

    const token = req.header("Authorization").split(" ")[1];

    //split 후 담긴 값이 있는지 확인
    if (token === undefined || token === null) {
        const newError = new Error("토큰이 필요합니다.");
        newError.status = 401;
        return next(newError);
    }

    try {
        const user = await jwtUtil.verifyToken(token);
        req.user = user;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            const newError = new Error("토큰이 만료되었습니다.");
            newError.status = 401;
            return next(newError);
        }

        if (error.name === "JsonWebTokenError") {
            const newError = new Error("토큰이 유효하지 않습니다.");
            newError.status = 401;
            return next(newError);
        }
    }
}

module.exports = authenticateUserToken;
