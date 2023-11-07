const productRouter = require("./productRouter");
const orderRouter = require("./orderRouter");
const authRouter = require("./authRouter");
const reviewRouter = require("./reviewRouter");
const userRouter = require("./userRouter");

const { Router } = require("express");
const router = Router();

router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/orders", orderRouter);
router.use("/reviews", reviewRouter);
router.use("/users", userRouter);

module.exports = {
    router,
};
