const { Router } = require("express");
const { Product, Option} = require("../models");
//const { authenticateUser, isAdmin } = require("../middleware/isAdmin");

const orderService = require("../services/orderService");

const productService = require("../services/productService");

const productRouter = Router();

productRouter.get("/", async (req, res, next) => {
    const { products, category } = req.query;

    //const BestPList = products.sort({sales : -1}).limit(10);
    //const NewPList = products.sort({stockedAt : -1}).limit(10);
    //const ReviewList = products.sort({stockedAt : -1}).limit(10);

    if (products !== undefined && products !== null) {
        products.split(",").forEach((eachProduct) => {
            if (!eachProduct instanceof String) {
                const error = new Error("찾으려는 물품 값이 유효하지 않습니다.");
                error.status = 400;
                return next(error);
            }
        });
    }

    if (category !== undefined && category !== null) {
        if (!category instanceof String) {
            const error = new Error("찾으려는 카테고리 값이 유효하지 않습니다.");
            error.status = 400;
            return next(error);
        }
    }

    //둘 다 입력
    if (category !== undefined && category !== null && products !== undefined && products !== null) {
        const arrOfProductId = products.split(",");
        const productsInId = await productService.getProductsById(arrOfProductId);

        const filteredProductByCategory = productsInId.filter((eachProduct) => {
            return eachProduct.category.some((eachCategory) => {
                return eachCategory.categoryName === category;
            });
        });

        if (filteredProductByCategory.length === 0) {
            const error = new Error("찾으려는 물품이 존재하지 않습니다.");
            error.status = 404;
            return next(error);
        } else {
            return res.status(200).json({
                products: filteredProductByCategory,
            });
        }
    }

    //카테고리만 입력
    if (category !== undefined && category !== null) {
        const productsInCategory = await productService.getProductsByCategory(category);
        return res.status(200).json({
            products: productsInCategory,
        });
    }


    //물품만 입력
    if (products !== undefined && products !== null) {
        const arrOfProductId = products.split(",");
        const productsInId = await productService.getProductsById(arrOfProductId);
        return res.status(200).json({
            products: productsInId,
        });
    }

    //카테고리, 물품 아이디 미 입력 시
    const allProducts = await productService.getAllProducts();
    return res.status(200).json({
        //Best product,
        //New product,
        products: allProducts,
    });
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
    const { name, price, stockedAt, discountRate, category, description, option, file } = req.body;

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
            stockedAt,
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


//상품 수정 -> admin만 가능하게끔
productRouter.patch('/:id', async (req, res, next) => {
    try {
        //console.log("수정하는 라우터입니다.");
        const {id} = req.params;

        const { name, price, sales, discountRate, category, description, option, file } = req.body;

        const updatedProduct = await productService.updateProduct(
            id,
            {
                name,
                price,
                sales,
                discountRate,
                category,
                description,
                option,
                file,
            }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
        }

        res.status(200).json(updatedProduct);
    } catch (err) {
        next(err);
        return;
    }
})

//상품 삭제 -> admin만 가능하게끔
productRouter.delete('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        if (id === undefined) {
            res.status(404).json({ message: '해당 상품의 아이디가 필요합니다.' });
        }

        const deleted = await productService.deleteProduct(id);

        if (deleted.success) {
            res.status(204).json({
                message: deleted.message,
                data: deleted.data,
            });
        } else {
            res.status(404).json({ message: deleted.message });
        }

    } catch (err) {
        next(err);
        return;
    }
});

module.exports = productRouter;
