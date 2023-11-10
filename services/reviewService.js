const mongoose = require("mongoose");

const { Review, User } = require("../models/index");

class ReviewService {
    /**
     * 최신 순으로 리뷰를 curDataNum개 가져옴
     *
     * @param curDataNum {Number} 가져오고자 하는 최신 리뷰 수
     * @return {[Review]} 리뷰 객체의 배열
     */
    async getCurrentReview(curDataNum) {
        const curReview = await Review.find({})
            .sort({ createdAt: -1 })
            .limit(curDataNum)
            .populate("product")
            .populate("article.author")
            .lean()
            .catch((error) => {
                const newError = new Error("리뷰를 불러오던 중 서버 내 문제가 발생했습니다.");
                newError.status = 500;
                throw newError;
            });

        return curReview;
    }

    /**
     * 물품 아이디를 기준으로 리뷰를 가져옴
     *
     * @param arrOfProductId {[String]} 물품의 아이디(_id) 배열
     * @return {[Review]} 리뷰 객체의 배열
     */
    async getReviewsByProductId(arrOfProductId) {
        const arrOfProductsIdObject = arrOfProductId.map((eachId) => {
            return new mongoose.Types.ObjectId(eachId);
        });

        const reviewByProduct = await Review.find({
            product: { $in: arrOfProductsIdObject }
        })
            .populate("product")
            .populate("article.author")
            .lean()
            .catch((error) => {
                const newError = new Error("리뷰를 불러오던 중 서버 내 문제가 발생했습니다.");
                newError.status = 500;
                throw newError;
            });

        return reviewByProduct;
    }

    /**
     * 물품 아이디를 기준으로 리뷰를 가져옴
     *
     * @param arrOfUserId {[String]} 유저의 아이디(userId) 배열
     * @return {[Review]} 리뷰 객체의 배열
     */
    async getReviewsByUserId(arrOfUserId) {
        const userByUserId = await User.find({
            userId: { $in: arrOfUserId }
        }).lean();
        const arrOfUserIdsObject = userByUserId.map((eachUser) => {
            return new mongoose.Types.ObjectId(eachUser._id);
        });

        const reviewByUser = await Review.find({
            "article.author": { $in: arrOfUserIdsObject }
        })
            .populate("product")
            .populate("article.author")
            .lean()
            .catch((error) => {
                const newError = new Error("리뷰를 불러오던 중 서버 내 문제가 발생했습니다.");
                newError.status = 500;
                throw newError;
            });

        return reviewByUser;
    }
}

module.exports = new ReviewService();
