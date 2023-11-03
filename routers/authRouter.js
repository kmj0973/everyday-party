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

router.post('/logout', async (req, res, next) => {
    //토큰이 없을 때
    console.log(req.header("Authorization"));
    token = req.header("Authorization").split(" ")[1];
    if (!token) {
        return res.json({
            status: 401,
            message: '토큰이 필요합니다.'
        });
    }

    //로그아웃 성공
    try {
        // 토큰 검증
        jwtUtil.verifyToken(token, (err, decoded) => {
            if (err) {
                return res.json({ 
                    status: 401,
                    message: '토큰이 유효하지 않습니다.' 
                });
            }

            return res.json({ message: '로그아웃되었습니다.' });

            //로그아웃 버튼 눌리면 토큰 지우고
            //localStorage.removeItem('token');
        })
    } catch (err) {
        console.log(err);
        res.json({
            status: 500,
            message: "서버 오류"
        })
    }
})

module.exports = router;
