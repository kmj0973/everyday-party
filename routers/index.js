const productRouter = require("./productRouter");
const orderRouter = require("./orderRouter");
const authRouter = require("./authRouter");

const { Router } = require("express");
const router = Router();

router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/order", orderRouter);

module.exports = {
    router,
};