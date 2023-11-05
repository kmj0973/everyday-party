const authRouter = require("./authRouter");
const productRouter = require("./productRouter");
const orderRouter = require("./orderRouter");

const { Router } = require("express");
const router = Router();

router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/order", orderRouter);

module.exports = {
    router,
};