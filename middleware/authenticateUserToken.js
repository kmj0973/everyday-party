const jwtUtil = require("../utils/jwtUtil.js");

async function authenticateUserToken(req, res, next) {
    const { authorization } = req.headers;
    if (authorization === undefined || authorization === null) {
        const error = new Error("토큰이 필요합니다.");
        error.status = 401;
        return next(error);
    }

    const token = authorization.split(" ")[1];

    // split 후 담긴 값이 있는지 확인
    if (token === undefined || token === null) {
        const error = new Error("토큰이 필요합니다.");
        error.status = 401;
        return next(error);
    }

    try {
        const user = await jwtUtil.verifyToken(token);
        req.user = user;
        return next();
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

        const newError = new Error("알 수 없는 에러가 발생했습니다.");
        newError.status = 500;
        return next(newError);
    }
}

module.exports = authenticateUserToken;
