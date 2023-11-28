const { Router } = require("express");

const userRouter = Router();

const { authenticateUserToken, authenticateUserData } = require("../middleware/index.js");

const validDataUtil = require("../utils/validDataUtil.js");
const passwordUtil = require("../utils/passwordUtil.js");

const userService = require("../services/userService.js");

// 일반 유저가 마이페이지 접속 시
userRouter.get("/me", authenticateUserToken, async (req, res) => {
    const decoded = req.user;
    const user = await userService.getUserById(decoded.userId);

    return res.status(200).json({
        user,
    });
});

// 개인 정보 업데이트
userRouter.put("/me", authenticateUserToken, authenticateUserData, async (req, res, next) => {
    const decoded = req.user;
    const user = await userService.getUserById(decoded.userId);

    if (user === undefined || user === null) {
        const error = new Error("존재하지 않는 아이디입니다.");
        error.status = 409;
        return next(error);
    }

    const { userId, password, email, name, address, phone, birthday } = req.body;

    const userInput = {
        userId,
        password,
        email,
        name,
        address,
        phone,
        birthday,
    };

    const validInfoOfUserInput = validDataUtil.processDataWithPut(user, userInput);
    if (password !== undefined && password !== null) {
        validInfoOfUserInput.password = await passwordUtil.hashPassword(validInfoOfUserInput.password);
    }

    const updatedUser = await userService.updateUser(user.userId, validInfoOfUserInput);

    return res.status(200).json({
        user: updatedUser,
    });
});

module.exports = userRouter;
