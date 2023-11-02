const { Product } = require("../models/index");

class ProductService {
    /**
     * 컬렉션 내 모든 물품 데이터 반환
     *
     * @return Array of Product 하나 이상의 모델 객체가 들어간 배열 또는 빈 배열
     */
    async getAllProducts() {
        const products = await Product.find({});
        if (!products) {
            return [];
        } else {
            return products;
        }
    }

    /**
     * 아이디(_id)에 따른 물품 하나를 반환
     *
     * @param id 물품의 아이디(_id)
     * @return Product 모델 객체
     */
    async getProductById(id) {
        const product = await Product.findById(id);
        if (!product) {
            throw new Error("No Exist Product");
        } else {
            return product;
        }
    }

    /**
     * 카테고리(category)에 따른 물품 하나 이상을 반환
     *
     * @param category 카테고리
     * @return Array of Product 하나 이상의 모델 객체가 들어간 배열
     */
    async getProductsByCategory(category) {
        const products = await Product.find({ category });
        if (!products) {
            throw new Error("No Exist Category");
        } else {
            return products;
        }
    }
}

module.exports = new ProductService();
