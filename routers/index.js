const authRouter = require("./authRouter");
const productRouter = require("./productRouter");

const { Router } = require("express");
const router = Router();

router.use("/products", productRouter);

module.exports = {
    router,
};
