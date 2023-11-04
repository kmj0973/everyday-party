const { Product, Option } = require("../models/index");

class ProductService {
    /**
     * 컬렉션 내 모든 물품 데이터 반환
     *
     * @return {[Product]} 하나 이상의 모델 객체가 들어간 배열 또는 빈 배열
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
     * @param id {String} 물품의 아이디(_id)
     * @return {Product} 모델 객체
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
     * @param category {String} 카테고리
     * @return {[Product]} 하나 이상의 모델 객체가 들어간 배열
     */
    async getProductsByCategory(category) {
        const products = await Product.find({ category });
        if (products.length === 0) {
            throw new Error("No Exist Category");
        } else {
            return products;
        }
    }

    /**
     * 카테고리(category)에 따른 물품 하나 이상을 반환
     *
     * @param size 상품의 사이즈 옵션
     * @param color  상품의 색 옵션
     * @return {[newOption]} 
     * _id: "옵션의 고유 ID",
        size: "옵션의 사이즈",
        color: "옵션의 색상"

        push는 배열 필드에 새로운 요소를 추가
        save는 메서드를 호출하여 변경 사항을 데이터베이스에 반영 하기 위해 사용
     */
    async createOption(size, color) {
        const newOption = new Option({ size, color });
        console.log("정상적으로 옵션이 생성되었습니다.")
        await newOption.save();
        console.log("정상적으로 옵션이 저장되었습니다.")
        return newOption;
    }

    /**
     * 카테고리(category)에 따른 물품 하나 이상을 반환
     *
     * @param productId 상품 객체의 아이디
     * @param optionId  옵션 객체의 아이디
     * @return {[Product]} 
     * _id: "상품의 고유 ID",
        name: "상품의 이름",
        price: "상품의 가격",
        ...
        option: [
            {
                _id: "추가된 옵션의 고유 아이디",
                size: "옵션의 사이즈",
                color: "옵션의 색상",
            },
        ] ->배열로 들어감

        사용처 :
        이미 생성된 상품에 나중에 옵션을 추가하려는 경우.
        하나의 옵션을 여러 상품에 추가하려는 경우.
     */
    async addOptionToProduct(productId, optionId) {
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error("상품을 찾을 수 없습니다.");
        }

        const option = await Option.findById(optionId);
        if (!option) {
            throw new Error("옵션을 찾을 수 없습니다.");
        }

        product.option.push(option);
        console.log("정상적으로 상품에 옵션 객체를 연결하였습니다.")
        await product.save();
        console.log("정상적으로 상품이 저장되었습니다.")
        return product;
    }
}

module.exports = new ProductService();
