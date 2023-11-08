const { User } = require("../models/schemas/user");

function authenticateUser(req, res, next) {
    // 사용자 인증 및 사용자 정보를 설정
    // 예시: 세션 또는 토큰을 통해 사용자 정보 설정
    req.user = {
        userId: "사용자 ID",
        grade: "사용자 역할",
    };
    next();
}

async function isAdmin(req, res, next) {
    try {
        // 사용자 객체에서 역할을 확인 + 접근
        const userGrade = req.user.grade; //
        // 관리자인 경우 다음 미들웨어 또는 라우터로 이동
        if (userGrade === "admin") {
            next();
        } else {
            res.status(403).json({ message: "관리자만 접근할 수 있습니다." });
        }
    } catch (err) {
        next(err);
    }
}

module.exports = isAdmin;
