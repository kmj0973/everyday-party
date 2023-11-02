const { Router } = require("express");
const router = Router();

const ProductService = require("../services/productService");

router.get("/", async (req, res, next) => {
    const { products, category } = req.query;
    let returnProducts = []; //전체적으로 데이터를 반환 할 배열

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

        try {
            for (eachProduct = 0; eachProduct < arrOfProductId.length; eachProduct++) {
                arrOfProductData.push(await ProductService.getProductById(arrOfProductId.at(eachProduct)));
            }
        } catch (error) {
            arrOfNotExistProductId.push(arrOfProductId.at(eachProduct));
        }

        if (returnProducts.length > 0) {
            //카테고리로 이미 반환받은 데이터가 있다면
            //필터로 카테고리 내에 존재하는 물품을 반환
            returnProducts = returnProducts.filter((product) => {
                return arrOfProductData.includes(product);
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
        const allProducts = await ProductService.getAllProducts();
        return res.json({
            status: 200,
            products: allProducts,
        });
    }
});

module.exports = router;
