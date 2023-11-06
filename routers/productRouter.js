const { Router } = require("express");
const { Product, Option } = require("../models");
const orderService = require("../services/productService");

const productRouter = Router();

productRouter.get("/", async (req, res, next) => {
    //console.log("해당상품을 조회하였습니다.");

    const { products, category } = req.query;
    //console.log(`id : ${products}` );

    //const BestPList = products.sort({sales : -1}).limit(10);
    //const NewPList = products.sort({entryDate : -1}).limit(10);
    //const ReviewList = products.sort({entryDate : -1}).limit(10);

    if ((!category || typeof category !== "string") && !products) {
        const allProducts = await productService.getAllProducts();
        return res.status(200).json({
            //Bestproduct,
            //Newproduct,
            products: allProducts,
        });
    }

    //카테고리가 존재하는 경우 카테고리를 기준으로 물품 데이터를 받아옴
    if (category) {
        try {
            const filteredProducts = await productService.getProductsByCategory(category);
            return res.json(filteredProducts);
        } catch (err) {
            const error = new Error(" ");
            error.status = 404;
            return next(error);
        }
    }

    if (products) {
        const arrOfProductId = products.split(",");
        const arrOfProductData = []; //Products 컬렉션 내 존재하는 물품 데이터
        const arrOfNotExistProductId = []; //Products 컬렉션 내 존재하지 않는 요청 물품 데이터의 아이디
        let eachProduct = 0;

        for (eachProduct = 0; eachProduct < arrOfProductId.length; eachProduct++) {
            try {
                arrOfProductData.push(await productService.getProductById(arrOfProductId.at(eachProduct)));
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

            //404는 에러이기 때문에 결과물을 담는건 x
            //있는 product들만 담아서 응답으로 보내주도록 수정
            return res.status(404).json({
                products: returnProducts,
                notExistProduct: arrOfNotExistProductId,
            });
        } else {
            return res.status(200).json({
                products: returnProducts,
            });
        }
    } else {
        const allProducts = await productService.getAllProducts();
        return res.json(200).json({
            //Bestproduct,
            //Newproduct,
            products: allProducts,
        });
    }
});

// productRouter.get('/:id', async (req, res, next) => {
//     console.log("아이템 조회 라우터")
//     const id = req.params.id;
//     try {
//         const newProduct = await Product.find({id});

//         res.json(newProduct);
//     } catch (err) {
//         next(err);
//     }
// })

//상품 생성
productRouter.post("/", async (req, res, next) => {
    //console.log("상품을 post합니다!");
    const { name, price, entryDate, discountRate, category, description, option, file } = req.body;

    try {
        const existingProduct = await productService.checkProductExists(name);

        if (existingProduct) {
            const error = new Error("이미 존재하는 상품입니다.");
            error.status = 409;
            throw error;
        }

        //모든 조건을 거치고 상품 만들기
        newProduct = await productService.createProduct({
            name,
            price,
            discountRate,
            category,
            entryDate,
            description,
            option,
            file,
        });

        //console.log("상품이 생성되었습니다.");

        //생성된 아이템
        res.status(201).json(newProduct);
    } catch (err) {
        next(err);
    }
});

//상품 아이템 삭제
productRouter.delete("/:id", async (req, res, next) => {
    try {
        console.log("삭제하는 라우터입니다.");
        const id = req.params.id;
        await Product.deleteOne({ _id: id });
        //console.log("삭제 완료");
        res.status(204).json({ message: "제품이 성공적으로 삭제되었습니다." });
    } catch (err) {
        next(err);
    }
});

module.exports = productRouter;
