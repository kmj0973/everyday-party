const { Router } = require("express");
const { Product, Option } = require("../models");
const ProductService = require("../services/productService");

const itemRouter = Router();

itemRouter.get("/", async (req, res, next) => {
    const { products, category } = req.query;
    let returnProducts = []; //전체적으로 데이터를 반환 할 배열

    if (!category && !products) {
        returnProducts = await ProductService.getAllProducts();
        return res.json({
            status: 200,
            products: returnProducts,
        });
    }

    //카테고리가 존재하는 경우 카테고리를 기준으로 물품 데이터를 받아옴
    if (category) {
        try {
            returnProducts = await ProductService.getProductsByCategory(category);
        } catch (error) {
            return res.json({
                status: 404,
                errorMessage: error.message,
            });
        }
    }

    if (products) {
        const arrOfProductId = [].concat(products.split(","));
        const arrOfProductData = []; //Products 컬렉션 내 존재하는 물품 데이터
        const arrOfNotExistProductId = []; //Products 컬렉션 내 존재하지 않는 요청 물품 데이터의 아이디
        let eachProduct = 0;

        for (eachProduct = 0; eachProduct < arrOfProductId.length; eachProduct++) {
            try {
                arrOfProductData.push(await ProductService.getProductById(arrOfProductId.at(eachProduct)));
            } catch (error) {
                arrOfNotExistProductId.push(arrOfProductId.at(eachProduct));
            }
        }

        if (returnProducts.length > 0) {
            //카테고리로 이미 반환받은 데이터가 있다면
            //필터로 카테고리 내에 존재하는 물품을 반환
            returnProducts = arrOfProductData.filter((product) => {
                return product.category === category;
            });
        } else {
            returnProducts = arrOfProductData;
        }

        if (arrOfNotExistProductId.length > 0) {
            //존재하지 않는 물품의 아이디가 하나 이상일 때
            return res.json({
                status: 404,
                products: returnProducts,
                notExistProduct: arrOfNotExistProductId,
            });
        } else {
            return res.json({
                status: 200,
                products: returnProducts,
            });
        }
    } else {
        return res.json({
            status: 200,
            products: returnProducts,
        });
    }
});

itemRouter.get("/:id", async (req, res, next) => {
    console.log("아이템 조회 라우터");
    const id = req.params.id;
    try {
        const newProduct = await Product.find({ id });

        res.json(newProduct);
    } catch (err) {
        next(err);
    }
});

//상품 생성
itemRouter.post("/", async (req, res, next) => {
    console.log("상품을 post합니다!");
    const { name, price, discountRate, category, description, option, file } = req.body;
    //const data = req.body;
    //console.log(data);
    try {
        //이미 존재하는 상품인지 확인하고 겹치면 오류던짐
        const isExist = await Product.findOne({ name });
        if (isExist) {
            throw new error("이미 존재하는 상품입니다.");
        }

        //해당 카테고리가 없는 경우
        // const isCategory = await category.findOne({category});
        // if (!isCategory) {
        //     throw new error("해당 카테고리는 존재하지 않습니다.");
        // }

        //상품을 올릴 때 이름과 가격이 없으면 오류 -> post를 위한 필수 조건임
        if (!name || !price) {
            throw new Error("상품 정보가 부족합니다(상품 이름 또는 가격)!!");
        }

        //모든 조건을 거치고 상품 만들기
        const newProduct = await Product.create({
            name,
            price,
        });
        console.log("상품이 생성되었습니다.");

        //생성된 아이템
        res.json({
            status: 201,
            newProduct,
        });
    } catch (err) {
        next(err);
    }
});

//상품 아이템 삭제
itemRouter.delete("/:id", async (req, res) => {
    console.log("삭제 라우터에 진입하였습니다.");
    const { id } = req.params;

    await Product.deleteOne({ id });
    res.json({ message: "제품이 성공적으로 삭제되었습니다." });
    console.log("삭제 완료");
});

module.exports = itemRouter;
