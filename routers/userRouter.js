const { Router } = require("express");
const userRouter = Router();

const { authenticateUserToken, authenticateUserData } = require("../middleware/index");

const validDataUtil = require("../utils/validDataUtil");
const passwordUtil = require("../utils/passwordUtil");

const userService = require("../services/userService");

// 일반 유저가 마이페이지 접속 시, 관리자 라우터는 따로 생성 예정
userRouter.get("/me", authenticateUserToken, async (req, res, next) => {
    const decoded = req.user;
    const user = await userService.getUserById(decoded.userId);

    return res.status(200).json({
        user,
    });
});

userRouter.put("/me", authenticateUserToken, authenticateUserData, async (req, res, next) => {
    const decoded = req.user;
    const user = await userService.getUserById(decoded.userId);

    const { userId, password, grade, email, name, address, phone, birthday } = req.body;
    const userInput = { userId, password, grade, email, name, address, phone, birthday };

    const validInfoOfUserInput = validDataUtil.processDataWithPut(user, userInput);
    validInfoOfUserInput.password = await passwordUtil.hashPassword(validInfoOfUserInput.password);

    const updatedUser = await userService.updateUser(user.userId, validInfoOfUserInput);

    return res.status(200).json({
        user: updatedUser,
    });
});

module.exports = userRouter;
