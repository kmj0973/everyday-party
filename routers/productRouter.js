const { Router } = require("express");
//const { authenticateUser, isAdmin } = require("../middleware/isAdmin");
const productService = require("../services/productService");
const { authenticatePageData, authenticateUserToken } = require("../middleware/index");


const productRouter = Router();

productRouter.get("/", authenticatePageData, async (req, res, next) => {
    const { products, category, page, perPage, orderBy, orderDirection } = req.query;
    const pageData = { page, perPage, orderBy, orderDirection };

    if (products !== undefined && products !== null) {
        if (products === "") {
            const error = new Error("찾으려는 물품 값이 유효하지 않습니다.");
            error.status = 400;
            next(error);
        }
        products.split(",").forEach((eachProduct) => {
            //console.log(typeof eachProduct);
            if (typeof eachProduct !== "string") {
                const error = new Error("찾으려는 물품 값이 유효하지 않습니다.");
                error.status = 400;
                next(error);
            }
        });
    }

    if (category !== undefined && category !== null) {
        if (typeof category !== "string") {
            const error = new Error("찾으려는 카테고리 값이 유효하지 않습니다.");
            error.status = 400;
            return next(error);
        }
    }

    //둘 다 입력
    if (category !== undefined && category !== null && products !== undefined && products !== null) {
        const arrOfProductId = products.split(",");
        try {
            const { products, totalPage } = await productService.getProductsById(arrOfProductId, pageData);
            const filteredProductByCategory = products.filter((eachProduct) => {
                return eachProduct.category.some((eachCategory) => {
                    return eachCategory.categoryName === category;
                });
            });

            if (filteredProductByCategory.length === 0) {
                const error = new Error("찾으려는 물품이 존재하지 않습니다.");
                error.status = 404;
                next(error);
            } else {
                return res.status(200).json({
                    products,
                    totalPage,
                });
            }
        } catch (error) {
            return next(error);
        }
    }

    //카테고리만 입력
    if (category !== undefined && category !== null) {
        try {
            const { products, totalPage } = await productService.getProductsByCategory(category, pageData);
            if (totalPage !== undefined && totalPage !== null) {
                return res.status(200).json({
                    products,
                    totalPage,
                });
            } else {
                return res.status(200).json({
                    products,
                });
            }
        } catch (error) {
            return next(error);
        }
    }

    //물품만 입력
    if (products !== undefined && products !== null) {
        const arrOfProductId = products.split(",");
        try {
            const { products, totalPage } = await productService.getProductsById(arrOfProductId, pageData);
            if (totalPage !== undefined && totalPage !== null) {
                return res.status(200).json({
                    products,
                    totalPage,
                });
            } else {
                return res.status(200).json({
                    products,
                });
            }
        } catch (error) {
            return next(error);
        }
    }

    //카테고리, 물품 아이디 미 입력 시
    try {
        const { products, totalPage } = await productService.getAllProducts(pageData);
        if (totalPage !== undefined && totalPage !== null) {
            return res.status(200).json({
                products,
                totalPage,
            });
        } else {
            return res.status(200).json({
                products,
            });
        }
    } catch (error) {
        return next(error);
    }
});


//상품 생성
productRouter.post("/",  async (req, res, next) => {
    //console.log("상품을 post합니다!");
    const { name, price, stockedAt, discountRate, category, description, option, file } = req.body;

    const { currentGrade } = req.query;
    if (currentGrade == "admin"){
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
            return next(err);
        }
    }else {
        return res.status(403).json({ message: "관리자 외에 접근할 수 없습니다." });
    }
    
});

//상품 수정 -> admin만 가능하게끔
productRouter.patch("/:id", authenticateUserToken, async (req, res, next) => {
    try {
        //console.log("수정하는 라우터입니다.");
        const { id } = req.params;
        const  currentGrade  = req.user.grade;
        if (currentGrade === "admin") {
            const { name, price, sales, discountRate, category, description, option, file } = req.body;

            const updatedProduct = await productService.updateProduct(id, {
                name,
                price,
                sales,
                discountRate,
                category,
                description,
                option,
                file,
            });

            if (!updatedProduct) {
                return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
            }
            res.status(200).json(updatedProduct);
        } else {
            return res.status(403).json({ message: "관리자 외에 접근할 수 없습니다." });
        }

        
    } catch (err) {
        return next(err);
    }
});

//상품 삭제 -> admin만 가능하게끔
productRouter.delete("/:id", authenticateUserToken, async (req, res, next) => {
    try {
        const {currentGrade} = req.query;
        console.log(currentGrade);

        const id = req.params.id;
        if (id === undefined) {
            res.status(404).json({
                message: "해당 상품의 아이디가 필요합니다.",
            });
        }

        if(currentGrade === 'admin')
        {
            const deleted = await productService.deleteProduct(id);
            if (deleted.success) {
                res.status(204).json({
                    message: deleted.message,
                    data: deleted.data,
                });
            } else {
                res.status(404).json({ message: deleted.message });
            }
        }
        else {
            return res.status(403).json({ message: "관리자 외에 접근할 수 없습니다." });
        }
        
    } catch (err) {
        return next(err);
    }
});

module.exports = productRouter;
