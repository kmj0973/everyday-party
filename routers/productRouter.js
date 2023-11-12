const { Router } = require("express");
const multer = require("multer");

const productService = require("../services/productService");
const { authenticatePageData, authenticateProductData, authenticateUserToken } = require("../middleware/index");

const validDataUtil = require("../utils/validDataUtil");

const productRouter = Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./images/product");
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});
const upload = multer({ storage: storage });

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
            if (category === "new") {
                const { products, totalPage } = await productService.getAllProducts({ ...pageData, orderBy: "stockedAt" });
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
            }

            if (category === "best") {
                const { products, totalPage } = await productService.getAllProducts({ ...pageData, orderBy: "sales" });
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
            }

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
productRouter.post("/", authenticateUserToken, upload.single("product_name"), authenticateProductData, async (req, res, next) => {
    const { name, price, stockedAt, discountRate, category, description, option } = req.body;
    const currentGrade = req.user.grade;
    if (currentGrade === "admin") {
        try {
            const existingProduct = await productService.checkProductExists(name);

            if (existingProduct) {
                const error = new Error("이미 존재하는 상품입니다.");
                error.status = 409;
                return next(error);
            }

            const file = req.file !== undefined && req.file !== null ? { path: "/" + req.file.path.replaceAll("\\", "/"), name: req.file.filename } : undefined;
            const parsedCategory = category !== undefined && category !== null ? JSON.parse(category) : undefined;
            const parsedOption = option !== undefined && option !== null ? JSON.parse(option) : undefined;

            const productInput = { name, price, stockedAt, discountRate, category: parsedCategory, description, option: parsedOption, file };
            const validInfoOfProductInput = validDataUtil.processDataWithPatch(productInput);

            //모든 조건을 거치고 상품 만들기
            newProduct = await productService.createProduct({
                validInfoOfProductInput,
            });

            //생성된 아이템
            res.status(201).json(newProduct);
        } catch (error) {
            return next(error);
        }
    } else {
        const error = new Error("관리자 이외에는 접근이 불가능합니다.");
        error.status = 403;
        return next(error);
    }
});

//상품 수정 -> admin만 가능하게끔
productRouter.patch("/:id", authenticateUserToken, upload.single("product_name"), authenticateProductData, async (req, res, next) => {
    try {
        const { id } = req.params;
        if (id === undefined || id === null) {
            return res.status(404).json({
                message: "해당 상품의 아이디가 필요합니다.",
            });
        }

        const currentGrade = req.user.grade;

        if (currentGrade === "admin") {
            const { name, price, stockedAt, discountRate, category, description, option } = req.body;

            if (name !== undefined || name !== null) {
                const { productByName, productById } = Promise.all([await productService.checkProductExists(name), await productService.getProductById(id)]);

                if (productByName !== undefined && productByName !== null) {
                    if (productByName._id !== productById._id) {
                        const error = new Error("이미 존재하는 상품으로 변경이 불가능합니다.");
                        error.status = 409;
                        return next(error);
                    }
                }
            }

            const file = req.file !== undefined && req.file !== null ? { path: "/" + req.file.path.replaceAll("\\", "/"), name: req.file.filename } : undefined;
            const parsedCategory = category !== undefined && category !== null ? JSON.parse(category) : undefined;
            const parsedOption = option !== undefined && option !== null ? JSON.parse(option) : undefined;

            const productInput = { name, price, stockedAt, discountRate, category: parsedCategory, description, option: parsedOption, file };
            const validInfoOfProductInput = validDataUtil.processDataWithPatch(productInput);

            const updatedProduct = await productService.updateProduct(id, { productData: validInfoOfProductInput });

            if (!updatedProduct) {
                return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
            }
            res.status(200).json(updatedProduct);
        } else {
            return res.status(403).json({ message: "관리자 외에 접근할 수 없습니다." });
        }
    } catch (error) {
        const newError = new Error("서버 내 오류가 발생했습니다.");
        newError.status = 500;
        return next(newError);
    }
});

//상품 삭제 -> admin만 가능하게끔
productRouter.delete("/:id", authenticateUserToken, async (req, res, next) => {
    try {
        
        const currentGrade = req.user.grade;
        const { id } = req.params;

        if (id === undefined || id === null) {
            return res.status(404).json({
                message: "해당 상품의 아이디가 필요합니다.",
            });
        }

        if (currentGrade === "admin") {
            const deleted = await productService.deleteProduct(id);
            if (deleted.success) {
                return res.status(204).json({});
            } else {
                return res.status(404).json({ message: deleted.message });
            }
        } else {
            return res.status(403).json({ message: "관리자 외에 접근할 수 없습니다." });
        }
    } catch (error) {
        const newError = new Error("서버 내 오류가 발생했습니다.");
        newError.status = 500;
        return next(newError);
    }
});

module.exports = productRouter;
