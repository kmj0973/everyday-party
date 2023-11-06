const { Product, Option } = require("../models/index");

class ProductService {
    constructor() {}
    /**
     * 컬렉션 내 모든 물품 데이터 반환
     *
     * @return {[Product]} 하나 이상의 모델 객체가 들어간 배열 또는 빈 배열
     * .lean()을 쓴 이유: 무거운 객체인 mongoose document가 아니라 일반 객체 리터럴이 리턴되어서 데이터를 가져오는 속도가 빨라짐
     */
    async getAllProducts() {
        const products = await Product.find({}).lean(); 
        return products;
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
            return res.status(404).json({
                error: "해당 카테고리는 존재하지 않습니다."
            })
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
        //console.log("정상적으로 옵션이 생성되었습니다.")
        await newOption.save();
        //console.log("정상적으로 옵션이 저장되었습니다.")
        return newOption.toObject();
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
        const product = await Product.findById(productId).lean();
        if (!product) {
            return res.status(404).json({ error: "상품을 찾을 수 없습니다." });
        }

        const option = await Option.findById(optionId).lean();
        if (!option) {
            return res.status(404).json({error: "옵션을 찾을 수 없습니다."});
        }

        product.option.push(option);
        //console.log("정상적으로 상품에 옵션 객체를 연결하였습니다.")
        await product.save();
        //console.log("정상적으로 상품이 저장되었습니다.")
        return product;
    }

    async checkProductExists (name) {
        const existingProduct = await Product.findOne({ name });

        return existingProduct;
    }

    async createProduct(productData) {
        if (!productData.name || !productData.price) {
            const error = new Error("상품 정보가 부족합니다(상품 이름 또는 가격)!!");
            error.status = 400;
            throw error;
        }

        //해당 카테고리가 없는 경우
        //await productService.getProductsByCategory(category);

        ////body에 담겨져서오는 client의 input값들을 검증해주는 코드가 있으면 좋을 것 같습니다.
        //const {size, color} = productData.option;

        const newProduct = await Product.create({
            name: productData.name, 
            price: productData.price, 
            discountRate: productData.discountRate, 
            category: productData.category, 
            entryDate: productData.entryDate,
            description: productData.description, 
            option: {
                size: Option.size, 
                color: Option.color
            },
            file: productData.file
        });

        return newProduct;
    }

    
}

module.exports = new ProductService();
