function isAdmin(req, res, next) {
    try {
        const userGrade = req.user.grade;
        // 관리자인 경우 다음 미들웨어 또는 라우터로 이동
        if (userGrade === "admin") {
            return next();
        }

        return res.status(403).json({ message: "관리자 외에 접근할 수 없습니다." });
    } catch (error) {
        const newError = new Error("관리자 검증 중 오류가 발생했습니다.");
        newError.status = 500;
        newError.cause = error;
        throw newError;
    }
}

module.exports = isAdmin;
