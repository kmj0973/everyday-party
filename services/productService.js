const mongoose = require("mongoose");
const fs = require("fs");

const { Product, Option, Category, File } = require("../models/index.js");

const allowedFieldMap = {
    _id: true,
    name: true,
    price: true,
    stockedAt: true,
    sales: true,
};

/**
 * 컬렉션 내 모든 물품 데이터 반환
 *
 * @param {Object} pageData { page(페이지), perPage(페이지 당 데이터 수), orderBy(정렬 기준), orderDirection(정렬 순서) }
 * @return {[Product]} 하나 이상의 모델 객체가 들어간 배열 또는 빈 배열
 */
const getFormatPageData = async (pageData, findCondition) => {
    const limit = pageData.perPage !== undefined && pageData.perPage !== null ? Number(pageData.perPage) : 3;
    const page = pageData.page !== undefined && pageData.page !== null ? Number(pageData.page) : 1;
    const offset = limit * (page - 1);
    const orderBy = pageData.orderBy ? pageData.orderBy : "_id";
    const orderDirection = pageData.orderDirection ? pageData.orderDirection : -1;
    const { total } = (await Product.aggregate([{ $match: findCondition }, { $group: { _id: "_id", total: { $sum: 1 } } }]))[0];
    const totalPage = Math.ceil(total / limit);

    const sortConfig = orderBy !== undefined && orderBy !== null ? { [orderBy]: orderDirection !== null && orderDirection !== undefined ? orderDirection : -1 } : { _id: 1 };

    return { limit, page, offset, orderBy, orderDirection, total, totalPage, sortConfig };
};

class ProductService {
    /**
     * 컬렉션 내 모든 물품 데이터 반환
     *
     * @param {Object} pageData { page(페이지), perPage(페이지 당 데이터 수), orderBy(정렬 기준), orderDirection(정렬 순서) }
     * @return {[Product]} 하나 이상의 모델 객체가 들어간 배열 또는 빈 배열
     */
    static async getAllProducts(pageData) {
        const { limit, offset, orderBy, totalPage, sortConfig, total } = await getFormatPageData(pageData, {});

        if (offset >= total) {
            const error = new Error("존재하지 않는 페이지입니다.");
            error.status = 400;
            throw error;
        }

        if (orderBy && !allowedFieldMap[orderBy]) {
            const error = new Error("지원하지 않는 필드입니다.");
            error.status = 400;
            throw error;
        }

        if ((pageData.perPage !== undefined && pageData.perPage !== null) || (pageData.page !== undefined && pageData.page !== null)) {
            const allProducts = await Product.find({})
                .populate("category")
                .sort(sortConfig)
                .skip(offset)
                .limit(limit)
                .lean()
                .catch((error) => {
                    const newError = new Error("물품 데이터를 가져오던 중 오류가 발생했습니다.");
                    newError.status = 500;
                    newError.cause = error;
                    throw newError;
                });

            return { allProducts, totalPage, offset, limit };
        }

        const allProducts = await Product.find({})
            .populate("category")
            .sort(sortConfig)
            .lean()
            .catch((error) => {
                const newError = new Error("물품 데이터를 가져오던 중 오류가 발생했습니다.");
                newError.status = 500;
                newError.cause = error;
                throw newError;
            });
        return { allProducts };
    }

    /**
     * 아이디(_id)에 따른 물품 하나를 반환
     *
     * @param id {String} 물품의 아이디(_id)
     * @return {Product} 물품 모델 객체의 배열
     */
    static async getProductById(id) {
        const product = await Product.findById(id)
            .lean()
            .catch((error) => {
                const newError = new Error("물품 데이터를 가져오던 중 오류가 발생했습니다.");
                newError.status = 500;
                newError.cause = error;
                throw newError;
            });

        if (product === null || product === undefined) {
            const error = new Error("찾으려는 물품이 존재하지 않습니다.");
            error.status = 404;
            throw error;
        }

        return product;
    }

    /**
     * 아이디(_id) 배열에 따른 물품 하나를 반환
     *
     * @param arrOfIds {[String]} 물품의 아이디(_id) 배열
     * @return {[Product]} 물품 모델 객체의 배열
     */
    static async getProductsById(arrOfIds) {
        const arrOfMongooseIds = arrOfIds.map((eachId) => {
            return new mongoose.Types.ObjectId(eachId);
        });

        const productsById = await Product.find({ _id: { $in: arrOfMongooseIds } })
            .populate("category")
            .lean()
            .catch((error) => {
                const newError = new Error("물품 데이터를 가져오던 중 오류가 발생했습니다.");
                newError.status = 500;
                newError.cause = error;
                throw newError;
            });
        if (productsById.length === 0) {
            const error = new Error("찾으려는 물품이 존재하지 않습니다.");
            error.status = 404;
            throw error;
        } else {
            return { productsById };
        }
    }

    /**
     * 카테고리(category)에 따른 물품 하나 이상을 반환
     *
     * @param category {String} 카테고리 값
     * @param {Object} pageData { page(페이지), perPage(페이지 당 데이터 수), orderBy(정렬 기준), orderDirection(정렬 순서) }
     * @return {[Product]} 하나 이상의 모델 객체가 들어간 배열
     */
    static async getProductsByCategory(category, pageData) {
        const matchCategoryData = await Category.findOne({ categoryName: category })
            .lean()
            .catch((error) => {
                const newError = new Error("카테고리 데이터를 가져오던 중 오류가 발생했습니다.");
                newError.status = 500;
                newError.cause = error;
                throw newError;
            });

        if (matchCategoryData === undefined || matchCategoryData === null) {
            const error = new Error("해당 카테고리는 존재하지 않습니다.");
            error.status = 404;
            return error;
        }

        const { limit, offset, orderBy, totalPage, sortConfig, total } = await getFormatPageData(pageData, { category: { $in: [matchCategoryData._id] } });

        if (offset >= total) {
            const error = new Error("존재하지 않는 페이지입니다.");
            error.status = 400;
            throw error;
        }

        if (orderBy && !allowedFieldMap[orderBy]) {
            const error = new Error("지원하지 않는 필드입니다.");
            error.status = 400;
            throw error;
        }

        if ((pageData.perPage !== undefined && pageData.perPage !== null) || (pageData.page !== undefined && pageData.page !== null)) {
            const productsByCategory = await Product.find({ category: { $in: [matchCategoryData._id] } })
                .populate("category")
                .sort(sortConfig)
                .skip(offset)
                .limit(limit)
                .lean()
                .catch((error) => {
                    const newError = new Error("물품 데이터를 가져오던 중 오류가 발생했습니다.");
                    newError.status = 500;
                    newError.cause = error;
                    throw newError;
                });

            return { productsByCategory, totalPage, offset, limit };
        }

        const productsByCategory = await Product.find({ category: { $in: [matchCategoryData._id] } })
            .populate("category")
            .sort(sortConfig)
            .lean()
            .catch((error) => {
                const newError = new Error("물품 데이터를 가져오던 중 오류가 발생했습니다.");
                newError.status = 500;
                newError.cause = error;
                throw newError;
            });
        return { productsByCategory };
    }

    /**
     * 컬렉션 내 해당하는 이름의 물품이 있는지 확인
     *
     * @param {string} name 물품의 이름
     * @return {Product} 하나의 물품 객체 데이터
     */
    static async checkProductExists(name) {
        const existingProduct = await Product.findOne({ name }).lean();
        return existingProduct;
    }

    /**
     * 새 물품 데이터 생성 및 컬렉션 저장
     *
     * @param {Object} validInfoOfProductInput null 또는 undefined 값으로 받은 속성을 제거한 물품의 정보 객체
     * @return {Product} 생성된 물품 객체 데이터
     */
    static async createProduct({ validInfoOfProductInput }) {
        const productData = {};
        if (validInfoOfProductInput.category !== undefined && validInfoOfProductInput.category !== null) {
            productData.category = await Category.find({ categoryName: { $in: validInfoOfProductInput.category } }).catch((error) => {
                const newError = new Error("카테고리 데이터를 가져오던 중 오류가 발생했습니다.");
                newError.status = 500;
                newError.cause = error;
                throw newError;
            });
        }
        if (validInfoOfProductInput.option !== undefined && validInfoOfProductInput.option !== null) {
            productData.option = new Option({
                size: validInfoOfProductInput.option.size,
                color: validInfoOfProductInput.option.color,
            });
        }
        if (validInfoOfProductInput.file !== undefined && validInfoOfProductInput.file !== null) {
            productData.file = new File({
                name: validInfoOfProductInput.file.name,
                path: validInfoOfProductInput.file.path,
            });
        }

        const newProduct = await Product.create({ ...validInfoOfProductInput, ...productData }).catch((error) => {
            const newError = new Error("물품 데이터를 생성하던 중 오류가 발생했습니다.");
            newError.status = 500;
            newError.cause = error;
            throw newError;
        });

        return newProduct.toObject();
    }

    /**
     * 기존 물품 데이터 업데이트
     *
     * @param {string} id 업데이트 하려는 물품의 아이디
     * @param {Object} productData 업데이트 하려는 물품의 정보 객체
     * @return {Product} 업데이트된 물품 객체 데이터
     */
    static async updateProduct(id, productData) {
        const objectsOfProductData = {};
        if (productData.category !== undefined && productData.category !== null) {
            objectsOfProductData.category = await Category.find({ categoryName: { $in: productData.category } }).catch((error) => {
                const newError = new Error("카테고리 데이터를 가져오던 중 오류가 발생했습니다.");
                newError.status = 500;
                newError.cause = error;
                throw newError;
            });
        }

        if (productData.option !== undefined && productData.option !== null) {
            objectsOfProductData.option = new Option({
                size: productData.option.size,
                color: productData.option.color,
            });
        }

        if (productData.file !== undefined && productData.file !== null) {
            objectsOfProductData.file = new File({
                name: productData.file.name,
                path: productData.file.path,
            });
        }

        const newProduct = { ...productData, ...objectsOfProductData };

        const updatedProduct = await Product.findByIdAndUpdate(id, newProduct, {
            new: true,
        }).catch((error) => {
            const newError = new Error("물품 데이터를 갱신하던 중 오류를 발생했습니다.");
            newError.status = 500;
            newError.cause = error;
            throw newError;
        });

        return updatedProduct;
    }

    /**
     * 아이디에 해당하는 물품 삭제
     *
     * @param {string} id 삭제 하려는 물품의 아이디
     * @return {Product} 삭제된 물품 객체 데이터
     */
    static async deleteProduct(id) {
        const deleteProduct = await Product.findById(id)
            .lean()
            .catch((error) => {
                const newError = new Error("물품 데이터를 가져오던 중 오류가 발생했습니다.");
                newError.status = 500;
                newError.cause = error;
                throw newError;
            });

        if (deleteProduct === undefined || deleteProduct === null) {
            const newError = new Error("삭제할 물품을 찾지 못했습니다.");
            newError.status = 404;
            throw newError;
        }

        if (deleteProduct.file.path !== null && deleteProduct.file.path !== undefined) {
            fs.unlink(`.${deleteProduct.file.path}`, (error) => {
                if (error) {
                    const newError = new Error("물품 데이터의 사진을 삭제하던 중 오류가 발생했습니다.");
                    newError.status = 500;
                    newError.cause = error;
                    throw newError;
                }
            });
        }

        await Product.deleteOne({ _id: deleteProduct._id }).catch((error) => {
            const newError = new Error("물품 데이터를 삭제하던 중 오류가 발생했습니다.");
            newError.status = 500;
            newError.cause = error;
            throw newError;
        });

        return deleteProduct;
    }
}

module.exports = ProductService;
