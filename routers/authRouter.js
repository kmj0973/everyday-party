const { Router } = require("express");
const router = Router();

const dotenv = require("dotenv");
dotenv.config();

const { authenticateUserToken, authenticateUserData } = require("../middleware/index");

const passwordUtil = require("../utils/passwordUtil");
const jwtUtil = require("../utils/jwtUtil");
const validDataUtil = require("../utils/validDataUtil");

const userService = require("../services/userService");

router.post("/login", async (req, res, next) => {
    const { userId, password } = req.body;

    // 아이디 존재 여부 검사
    const existingUser = await userService.getUserById(userId);

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

router.post("/logout", authenticateUserToken, async (req, res, next) => {
    return res.status(200).json({ message: "로그아웃되었습니다." });
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
            const error = new Error("아이디 정보가 이미 존재합니다.");
            error.status = 409;
            return next(error);
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
            const error = new Error("이메일 정보가 이미 존재합니다.");
            error.status = 409;
            return next(error);
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
            const error = new Error("전화번호 정보가 이미 존재합니다.");
            error.status = 409;
            return next(error);
        } else {
            return res.sendStatus(200);
        }
    }
});

router.post("/sign-up", authenticateUserData, async (req, res, next) => {
    const { userId, password, grade, email, name, address, phone, birthday } = req.body;

    const userInput = { userId, password, grade, email, name, address, phone, birthday };

    const validInfoOfUserInput = validDataUtil.processDataWithPatch(userInput);
    validInfoOfUserInput.password = await passwordUtil.hashPassword(validInfoOfUserInput.password);

    try {
        await userService.createUser(validInfoOfUserInput);
        return res.sendStatus(200);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
