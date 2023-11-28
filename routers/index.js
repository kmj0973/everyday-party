const { Router } = require("express");

const productRouter = require("./productRouter.js");
const orderRouter = require("./orderRouter.js");
const authRouter = require("./authRouter.js");
const reviewRouter = require("./reviewRouter.js");
const userRouter = require("./userRouter.js");

const router = Router();

router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/orders", orderRouter);
router.use("/reviews", reviewRouter);
router.use("/users", userRouter);

module.exports = {
    router,
};
