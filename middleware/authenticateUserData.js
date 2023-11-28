async function authenticateUserData(req, res, next) {
    const { userId, password, grade, email, name, address, phone, birthday } = req.body;

    // 유저 아이디 검증 - 문자열 / 존재하는 아이디
    if (userId !== undefined && userId !== null) {
        if (typeof userId !== "string") {
            const error = new Error("아이디 값이 유효하지 않습니다.");
            error.status = 400;
            return next(error);
        }
    }

    // 비밀번호
    if (password !== undefined && userId !== null) {
        if (typeof password !== "string") {
            const error = new Error("비밀번호 값이 유효하지 않습니다.");
            error.status = 400;
            return next(error);
        }
    }

    if (grade !== undefined && grade !== null) {
        if (typeof grade !== "string") {
            const error = new Error("등급 값이 유효하지 않습니다.");
            error.status = 400;
            return next(error);
        }
    }

    // 이메일 검증 - 문자열 / 이메일 형식
    if (email !== undefined && email !== null) {
        const emailRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        if (!emailRegex.test(email) || typeof email !== "string") {
            const error = new Error("이메일 값이 유효하지 않습니다.");
            error.status = 400;
            return next(error);
        }
    }

    // 이름 - 문자열
    if (name !== undefined && name !== null) {
        if (typeof name !== "string") {
            const error = new Error("이름 값이 유효하지 않습니다.");
            error.status = 400;
            return next(error);
        }
    }

    // 주소 - 문자열
    if (address !== undefined && address !== null) {
        if (!Array.isArray(address)) {
            const error = new Error("주소 값이 유효하지 않습니다.");
            error.status = 400;
            return next(error);
        }

        const eachAddress = Object.values(address);
        for (let eachAddressIndex = 0; eachAddressIndex < eachAddress.length; eachAddressIndex += 1) {
            if (typeof eachAddress[eachAddressIndex] !== "string") {
                const error = new Error("주소 값이 유효하지 않습니다.");
                error.status = 400;
                return next(error);
            }
        }
    }

    // 전화번호 - 문자열
    if (phone !== undefined && phone !== null) {
        const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
        if (!phoneRegex.test(phone) || typeof phone !== "string") {
            const error = new Error("전화번호 값이 유효하지 않습니다.");
            error.status = 400;
            return next(error);
        }
    }

    // 생일 - 날짜
    if (birthday !== undefined && birthday !== null) {
        if (typeof birthday !== "number") {
            const error = new Error("생일 값이 유효하지 않습니다.");
            error.status = 400;
            return next(error);
        }
    }

    return next();
}

module.exports = authenticateUserData;
