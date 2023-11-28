const { Router } = require("express");

const reviewService = require("../services/reviewService.js");

const reviewRouter = Router();

// 모든 리뷰 조회
reviewRouter.get("/", async (req, res, next) => {
    const { curDataNum } = req.query;

    if (curDataNum !== undefined && curDataNum !== null && typeof curDataNum !== "number") {
        const error = new Error("쿼리 값이 유효하지 않습니다.");
        error.status = 400;
        return next(error);
    }

    const curReview = await reviewService.getCurrentReview(curDataNum !== undefined && curDataNum !== null ? curDataNum : 8);
    return res.status(200).json({ reviews: curReview });
});

// 물품 별 리뷰 조회
reviewRouter.get("/products", async (req, res, next) => {
    const { products } = req.query;
    const arrOfProductsIdString = products.split(",");

    if (products !== undefined && products !== null) {
        for (let idIndex = 0; idIndex < arrOfProductsIdString.length; idIndex += 1) {
            if (typeof arrOfProductsIdString[idIndex] !== "string") {
                const error = new Error("물품 아이디 값이 유효하지 않습니다.");
                error.status = 400;
                return next(error);
            }
        }
    }

    const reviewByProduct = await reviewService.getReviewsByProductId(arrOfProductsIdString);

    return res.status(200).json({
        reviews: reviewByProduct,
    });
});

// 사용자 별 리뷰 조회
reviewRouter.get("/users", async (req, res, next) => {
    const { users } = req.query;
    const arrOfUserIdsString = users.split(",");

    if (users !== undefined && users !== null) {
        for (let idIndex = 0; idIndex < arrOfUserIdsString.length; idIndex += 1) {
            if (typeof arrOfUserIdsString[idIndex] !== "string") {
                const error = new Error("유저 아이디 값이 유효하지 않습니다.");
                error.status = 400;
                return next(error);
            }
        }
    }

    const reviewByUser = await reviewService.getReviewsByUserId(arrOfUserIdsString);

    return res.status(200).json({
        reviews: reviewByUser,
    });
});

module.exports = reviewRouter;
