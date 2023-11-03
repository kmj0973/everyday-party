const { Router } = require("express");
const router = Router();

const { User } = require("../models/index");

const passwordUtil = require("../utils/passwordUtil");
const jwtUtil = require("../utils/jwtUtil");

const dotenv = require("dotenv");
dotenv.config();

const UserService = require("../services/UserService");

router.post("/login", async (req, res, next) => {
    const { userId, password } = req.body;

    // 아이디 존재 여부 검사
    const isUserIdExist = await User.findOne({ userId });
    if (!isUserIdExist) {
        return res.json({
            status: 400,
            errorMessage: "Invalid ID or wrong password",
        });
    }

    //비밀번호 일치 여부 검사
    const isCorrectPassword = await passwordUtil.comparePassword(password, isUserIdExist.password);
    if (!isCorrectPassword) {
        return res.json({
            status: 400,
            errorMessage: "Invalid ID or wrong password",
        });
    }

    const token = jwtUtil.setUserToken(isUserIdExist);

    return res.json({
        token,
    });
});

router.post("/logout", async (req, res, next) => {
    //토큰이 없을 때
    console.log(req.header("Authorization"));
    token = req.header("Authorization").split(" ")[1];
    if (!token) {
        return res.json({
            status: 401,
            message: "토큰이 필요합니다.",
        });
    }

    //로그아웃 성공
    try {
        // 토큰 검증
        jwtUtil.verifyToken(token, (err, decoded) => {
            if (err) {
                return res.json({
                    status: 401,
                    message: "토큰이 유효하지 않습니다.",
                });
            }

            return res.json({ message: "로그아웃되었습니다." });
        });
    } catch (err) {
        console.log(err);
        res.json({
            status: 500,
            message: "서버 오류",
        });
    }
});

router.post("/sign-up", async (req, res, next) => {
    //1. 아이디 입력
    //2. 비밀번호 입력
    //3. 이메일 및 필수 값이 아닌 값 입력
    //4. 모든 값을 입력하고 입력한 값으로 회원가입 여부 결정
    const { step } = req.body;
    if (step === 1) {
        //아이디 중복 검사
        const { userId } = req.body;
        const user = await UserService.getUserById(userId);
        if (user) {
            return res.json({
                status: 409,
                errorMessage: "ID is already exist",
            });
        } else {
            return res.json({
                status: 200,
            });
        }
    } else if (step === 3) {
        const { email, phone } = req.body;
        const [userByEmail, userByPhone] = await Promise.all([UserService.getUserByEmail(email), UserService.getUserByPhone(phone)]);
        if (userByEmail && userByPhone) {
            return res.json({
                status: 409,
                errorMessage: `email and phone is already exist`,
            });
        } else if (userByEmail || userByPhone) {
            return res.json({
                status: 409,
                errorMessage: `${userByEmail ? "email" : ""}${userByPhone ? "phone" : ""} is already exist`,
            });
        } else {
            return res.json({
                status: 200,
            });
        }
    } else if (step === 4) {
        const { userId, password, grade, email, name, address, phone, birthday } = req.body;

        let validInfoOfUserInput = { userId, password, grade, email, name, address, phone, birthday };
        for (let [key, value] of Object.entries(validInfoOfUserInput)) {
            if (!value) {
                Reflect.deleteProperty(validInfoOfUserInput, key);
            }
        }

        const newUser = new User(validInfoOfUserInput);
        newUser.password = await passwordUtil.hashPassword(newUser.password);

        await newUser.save().then((data) => {
            return res.json({
                status: 200,
            });
        });
    }
});

module.exports = router;
