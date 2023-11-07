const { Router } = require("express");
const router = Router();

const passwordUtil = require("../utils/passwordUtil");
const jwtUtil = require("../utils/jwtUtil");

const dotenv = require("dotenv");
dotenv.config();

const userService = require("../services/UserService");

router.post("/login", async (req, res, next) => {
    const { userId, password } = req.body;

    // 아이디 존재 여부 검사
    const existingUser = await userService.getUserById(userId);
    console.log(existingUser);
    if (existingUser === undefined || existingUser === null) {
        const error = new Error("잘못된 아이디 또는 비밀번호 입니다.");
        error.status = 400;
        return next(error);
    }

    //비밀번호 일치 여부 검사
    const isCorrectPassword = await passwordUtil.comparePassword(password, existingUser.password);
    if (!isCorrectPassword) {
        const error = new Error("잘못된 아이디 또는 비밀번호 입니다.");
        error.status = 400;
        return next(error);
    }

    const token = jwtUtil.createUserToken(existingUser);

    return res.json({
        token,
    });
});

router.post("/logout", async (req, res, next) => {
    //토큰이 없을 때
    console.log(req.header("Authorization"));
    token = req.header("Authorization").split(" ")[1];
    if (!token) {
        return res.status(401).json({
            message: "토큰이 필요합니다.",
        });
    }

    //로그아웃 성공
    try {
        // 토큰 검증
        try {
            const decoded = await jwtUtil.verifyToken(token);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({
                    message: "토큰이 만료되었습니다.",
                });
            }

            if (err.name === "JsonWebTokenError") {
                return res.status(401).json({
                    message: "토큰이 유효하지 않습니다.",
                });
            }
        }

        return res.json({ message: "로그아웃되었습니다." });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "서버 오류",
        });
    }
});

router.get("/check", async (req, res, next) => {
    const { userId, email, phone } = req.query;

    if (userId !== undefined && userId !== null) {
        if (!userId instanceof String) {
            const error = new Error("아이디 값이 유효하지 않습니다.");
            error.status = 400;
            return next(error);
        }

        const user = await userService.getUserById(userId);
        if (user !== null && user !== undefined) {
            return res.status(409).json({
                errorMessage: "이미 존재하는 아이디입니다.",
            });
        } else {
            return res.sendStatus(200);
        }
    }

    if (email !== undefined && email !== null) {
        if (!email instanceof String) {
            const error = new Error("이메일 값이 유효하지 않습니다.");
            error.status = 400;
            return next(error);
        }

        const userByEmail = await userService.getUserByEmail(email);

        if (userByEmail) {
            return res.status(409).json({
                errorMessage: `이메일 정보가 이미 존재합니다.`,
            });
        } else {
            return res.sendStatus(200);
        }
    }

    if (phone !== undefined && phone !== null) {
        if (!phone instanceof String) {
            const error = new Error("전화번호 값이 유효하지 않습니다.");
            error.status = 400;
            return next(error);
        }

        const userByPhone = await userService.getUserByPhone(phone);

        if (userByPhone) {
            return res.status(409).json({
                errorMessage: `전화번호 정보가 이미 존재합니다.`,
            });
        } else {
            return res.sendStatus(200);
        }
    }
});

router.post("/sign-up", async (req, res, next) => {
    const { userId, password, grade, email, name, address, phone, birthday } = req.body;

    let validInfoOfUserInput = { userId, password, grade, email, name, address, phone, birthday };
    for (let [key, value] of Object.entries(validInfoOfUserInput)) {
        if (!value) {
            Reflect.deleteProperty(validInfoOfUserInput, key);
        }
    }

    try {
        await userService.createUser(validInfoOfUserInput);
        return res.sendStatus(200);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
