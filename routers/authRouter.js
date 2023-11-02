const { Router } = require("express");
const router = Router();

const { User } = require("../models/index");

const passwordUtil = require("../utils/passwordUtil");
const jwtUtil = require("../utils/jwtUtil");

const dotenv = require("dotenv");
dotenv.config();

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

module.exports = router;
