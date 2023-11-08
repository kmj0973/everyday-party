const { Router } = require("express");
const reviewRouter = Router();

const reviewService = require("../services/reviewService");

reviewRouter.get("/", async (req, res, next) => {
  const { curDataNum } = req.query;

  if (
    curDataNum !== undefined &&
    curDataNum !== null &&
    typeof curDataNum !== "number"
  ) {
    const error = new Error("쿼리 값이 유효하지 않습니다.");
    error.status = 400;
    next(error);
  }

  const curReview = await reviewService.getCurrentReview(curDataNum ?? 8);
  return res.status(200).json({ reviews: curReview });
});

reviewRouter.get("/products", async (req, res, next) => {
  const { products } = req.query;
  const arrOfProductsIdString = products.split(",");

  if (products !== undefined && products !== null) {
    arrOfProductsIdString.forEach((eachId) => {
      if (typeof eachId !== "string") {
        const error = new Error("물품 아이디 값이 유효하지 않습니다.");
        error.status = 400;
        next(error);
      }
    });
  }

  const reviewByProduct = await reviewService.getReviewsByProductId(
    arrOfProductsIdString,
  );

  return res.status(200).json({
    reviews: reviewByProduct,
  });
});

reviewRouter.get("/users", async (req, res, next) => {
  const { users } = req.query;
  const arrOfUserIdsString = users.split(",");

  if (users !== undefined && users !== null) {
    arrOfUserIdsString.forEach((eachId) => {
      if (typeof eachId !== "string") {
        const error = new Error("유저 아이디 값이 유효하지 않습니다.");
        error.status = 400;
        next(error);
      }
    });
  }

  const reviewByUser =
    await reviewService.getReviewsByUserId(arrOfUserIdsString);

  return res.status(200).json({
    reviews: reviewByUser,
  });
});

module.exports = reviewRouter;
