const { Router } = require("express");
const multer = require("multer");

const productService = require("../services/productService.js");
const { authenticatePageData, authenticateProductData, authenticateUserToken, isAdmin } = require("../middleware/index.js");

const validDataUtil = require("../utils/validDataUtil.js");

const productRouter = Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./images/product");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${encodeURIComponent(file.originalname)}`);
    },
});
const upload = multer({ storage });

// 물품 데이터 조회
productRouter.get("/", authenticatePageData, async (req, res, next) => {
    const { products, category, page, perPage, orderBy, orderDirection } = req.query;
    const pageData = { page, perPage, orderBy, orderDirection };

    if (products !== undefined && products !== null) {
        if (products === "") {
            const error = new Error("찾으려는 물품 값이 유효하지 않습니다.");
            error.status = 400;
            next(error);
        }
        const arrOfProductIds = products.split(",");
        for (let idIndex = 0; idIndex < arrOfProductIds.length; idIndex += 1) {
            if (typeof arrOfProductIds[idIndex] !== "string") {
                const error = new Error("찾으려는 물품 값이 유효하지 않습니다.");
                error.status = 400;
                next(error);
            }
        }
    }

    if (category !== undefined && category !== null) {
        if (typeof category !== "string") {
            const error = new Error("찾으려는 카테고리 값이 유효하지 않습니다.");
            error.status = 400;
            return next(error);
        }
    }

    // 둘 다 입력
    if (category !== undefined && category !== null && products !== undefined && products !== null) {
        const arrOfProductId = products.split(",");
        try {
            const { productsById } = await productService.getProductsById(arrOfProductId);
            const filteredProductByCategory = productsById.filter((eachProduct) => {
                return eachProduct.category.some((eachCategory) => {
                    return eachCategory.categoryName === category;
                });
            });

            if (filteredProductByCategory.length === 0) {
                const error = new Error("찾으려는 물품이 존재하지 않습니다.");
                error.status = 404;
                return next(error);
            }

            return res.status(200).json({
                products: productsById,
            });
        } catch (error) {
            return next(error);
        }
    }

    // 카테고리만 입력
    if (category !== undefined && category !== null) {
        try {
            if (category === "new") {
                const { allProducts, totalPage, offset, limit } = await productService.getAllProducts({ ...pageData, orderBy: "stockedAt" });
                if (totalPage !== undefined && totalPage !== null) {
                    return res.status(200).json({
                        products: allProducts,
                        totalPage,
                        offset,
                        limit,
                    });
                }
                return res.status(200).json({
                    products: allProducts,
                });
            }

            if (category === "best") {
                const { allProducts, totalPage, offset, limit } = await productService.getAllProducts({ ...pageData, orderBy: "sales" });
                if (totalPage !== undefined && totalPage !== null) {
                    return res.status(200).json({
                        products: allProducts,
                        totalPage,
                        offset,
                        limit,
                    });
                }
                return res.status(200).json({
                    products: allProducts,
                });
            }

            const { productsByCategory, totalPage, offset, limit } = await productService.getProductsByCategory(category, pageData);
            if (totalPage !== undefined && totalPage !== null) {
                return res.status(200).json({
                    products: productsByCategory,
                    totalPage,
                    offset,
                    limit,
                });
            }
            return res.status(200).json({
                products: productsByCategory,
            });
        } catch (error) {
            return next(error);
        }
    }

    // 물품만 입력
    if (products !== undefined && products !== null) {
        const arrOfProductId = products.split(",");
        try {
            const { productsById } = await productService.getProductsById(arrOfProductId);
            return res.status(200).json({
                products: productsById,
            });
        } catch (error) {
            return next(error);
        }
    }

    // 카테고리, 물품 아이디 미 입력 시
    try {
        const { allProducts, totalPage, offset, limit } = await productService.getAllProducts(pageData);
        if (totalPage !== undefined && totalPage !== null) {
            return res.status(200).json({
                products: allProducts,
                totalPage,
                offset,
                limit,
            });
        }
        return res.status(200).json({
            products: allProducts,
        });
    } catch (error) {
        return next(error);
    }
});

// 상품 생성
productRouter.post("/", authenticateUserToken, authenticateProductData, isAdmin, upload.single("product_name"), async (req, res, next) => {
    const { name, price, stockedAt, discountRate, category, description, option } = req.body;
    try {
        const existingProduct = await productService.checkProductExists(name);

        if (existingProduct) {
            const error = new Error("이미 존재하는 상품입니다.");
            error.status = 409;
            return next(error);
        }

        const file = req.file !== undefined && req.file !== null ? { path: `/${req.file.path.replaceAll("\\", "/")}`, name: req.file.filename } : undefined;
        const parsedCategory = category !== undefined && category !== null ? JSON.parse(category) : undefined;
        const parsedOption = option !== undefined && option !== null ? JSON.parse(option) : undefined;

        const productInput = { name, price, stockedAt, discountRate, category: parsedCategory, description, option: parsedOption, file };
        const validInfoOfProductInput = validDataUtil.processDataWithPatch(productInput);

        // 모든 조건을 거치고 상품 만들기
        const newProduct = await productService.createProduct({
            validInfoOfProductInput,
        });

        // 생성된 아이템
        return res.status(201).json(newProduct);
    } catch (error) {
        return next(error);
    }
});

// 상품 수정 -> admin만 가능하게끔
productRouter.patch("/:id", authenticateUserToken, authenticateProductData, isAdmin, upload.single("product_name"), async (req, res, next) => {
    try {
        const { id } = req.params;
        if (id === undefined || id === null) {
            const error = new Error("해당 상품의 아이디가 필요합니다.");
            error.status = 400;
            return next(error);
        }

        const { name, price, stockedAt, discountRate, category, description, option } = req.body;

        if (name !== undefined || name !== null) {
            const { productByName, productById } = await Promise.all([productService.checkProductExists(name), productService.getProductById(id)]);

            if (productByName !== undefined && productByName !== null) {
                if (productByName._id !== productById._id) {
                    const error = new Error("이미 존재하는 상품으로 변경이 불가능합니다.");
                    error.status = 409;
                    return next(error);
                }
            }
        }

        const file = req.file !== undefined && req.file !== null ? { path: `/${req.file.path.replaceAll("\\", "/")}`, name: req.file.filename } : undefined;
        const parsedCategory = category !== undefined && category !== null ? JSON.parse(category) : undefined;
        const parsedOption = option !== undefined && option !== null ? JSON.parse(option) : undefined;

        const productInput = { name, price, stockedAt, discountRate, category: parsedCategory, description, option: parsedOption, file };
        const validInfoOfProductInput = validDataUtil.processDataWithPatch(productInput);

        const updatedProduct = await productService.updateProduct(id, { productData: validInfoOfProductInput });

        if (updatedProduct === undefined || updatedProduct === null) {
            const error = new Error("상품을 찾을 수 없습니다.");
            error.status = 404;
            return next(error);
        }

        return res.status(200).json(updatedProduct);
    } catch (error) {
        const newError = new Error("서버 내 오류가 발생했습니다.");
        newError.status = 500;
        return next(newError);
    }
});

// 상품 삭제 -> admin만 가능하게끔
productRouter.delete("/:id", authenticateUserToken, isAdmin, async (req, res, next) => {
    try {
        const { id } = req.params;

        if (id === undefined || id === null) {
            return res.status(404).json({
                message: "해당 상품의 아이디가 필요합니다.",
            });
        }

        const deletedProduct = await productService.deleteProduct(id);

        if (deletedProduct === undefined || deletedProduct === null) {
            const error = new Error("상품을 찾을 수 없습니다.");
            error.status = 404;
            return next(error);
        }
        return res.status(204).json({});
    } catch (error) {
        const newError = new Error("서버 내 오류가 발생했습니다.");
        newError.status = 500;
        return next(newError);
    }
});

module.exports = productRouter;
