const mongoose = require("mongoose");

const { Product, Option, Category, File } = require("../models/index");

const allowedFieldMap = {
    _id: true,
    name: true,
    price: true,
    stockedAt: true,
    sales: true,
};

const getFormatPageData = async (pageData) => {
    const limit = pageData.perPage !== undefined && pageData.perPage !== null ? Number(pageData.perPage) : 3;
    const page = pageData.page !== undefined && pageData.page !== null ? Number(pageData.page) : 1;
    const offset = limit * (page - 1);
    const orderBy = pageData.orderBy ?? "_id";
    const orderDirection = pageData.orderDirection ?? -1;
    const total = await Product.countDocuments();
    const totalPage = Math.ceil(total / limit);

    const sortConfig = orderBy !== undefined && orderBy !== null ? { [orderBy]: orderDirection ?? -1 } : { _id: 1 };

    return { limit, page, offset, orderBy, orderDirection, total, totalPage, sortConfig };
};

class ProductService {
    /**
     * 컬렉션 내 모든 물품 데이터 반환
     *
     * @param {Object} pageData { page(페이지), perPage(페이지 당 데이터 수), orderBy(정렬 기준), orderDirection(정렬 순서) }
     * @return {[Product]} 하나 이상의 모델 객체가 들어간 배열 또는 빈 배열
     */
    async getAllProducts(pageData) {
        const { limit, offset, orderBy, totalPage, sortConfig } = await getFormatPageData(pageData);

        if (orderBy && !allowedFieldMap[orderBy]) {
            const error = new Error("지원하지 않는 필드입니다.");
            error.status = 404;
            throw error;
        }

        if ((pageData.perPage !== undefined && pageData.perPage !== null) || (pageData.page !== undefined && pageData.page !== null)) {
            const products = await Product.find({})
                .populate("category")
                .sort(sortConfig)
                .skip(offset)
                .limit(limit)
                .lean()
                .catch((error) => {
                    const newError = new Error("물품 데이터를 가져오던 중 오류가 발생했습니다.");
                    newError.status = 500;
                    throw newError;
                });

            if (products.length === 0) {
                const error = new Error("해당 페이지가 존재하지 않습니다.");
                error.status = 404;
                throw error;
            }
            return { products, totalPage };
        } else {
            const products = await Product.find({})
                .populate("category")
                .sort(sortConfig)
                .lean()
                .catch((error) => {
                    const newError = new Error("물품 데이터를 가져오던 중 오류가 발생했습니다.");
                    newError.status = 500;
                    throw newError;
                });
            return { products };
        }
    }

    /**
     * 아이디(_id)에 따른 물품 하나를 반환
     *
     * @param id {String} 물품의 아이디(_id)
     * @return {Product} 물품 모델 객체의 배열
     */
    async getProductById(id) {
        const product = await Product.findById(id)
            .lean()
            .catch((error) => {
                const newError = new Error("물품 데이터를 가져오던 중 오류가 발생했습니다.");
                newError.status = 500;
                throw newError;
            });

        if (product === null || product === undefined) {
            const error = new Error("찾으려는 물품이 존재하지 않습니다.");
            error.status = 404;
            throw error;
        } else {
            return product;
        }
    }

    /**
     * 아이디(_id) 배열에 따른 물품 하나를 반환
     *
     * @param arrOfId {[String]} 물품의 아이디(_id) 배열
     * @param {Object} pageData { page(페이지), perPage(페이지 당 데이터 수), orderBy(정렬 기준), orderDirection(정렬 순서) }
     * @return {[Product]} 물품 모델 객체의 배열
     */
    async getProductsById(arrOfId, pageData) {
        const { limit, offset, orderBy, totalPage, sortConfig } = await getFormatPageData(pageData);

        if (orderBy && !allowedFieldMap[orderBy]) {
            const error = new Error("지원하지 않는 필드입니다.");
            error.status = 404;
            throw error;
        }

        arrOfId = arrOfId.map((eachId) => {
            return new mongoose.Types.ObjectId(eachId);
        });

        if ((pageData.perPage !== undefined && pageData.perPage !== null) || (pageData.page !== undefined && pageData.page !== null)) {
            const products = await Product.find({ _id: { $in: arrOfId } })
                .populate("category")
                .sort(sortConfig)
                .skip(offset)
                .limit(limit)
                .lean()
                .catch((error) => {
                    const newError = new Error("물품 데이터를 가져오던 중 오류가 발생했습니다.");
                    newError.status = 500;
                    throw newError;
                });
            if (products.length === 0) {
                const error = new Error("해당 페이지가 존재하지 않습니다.");
                error.status = 404;
                throw error;
            } else {
                return { products, totalPage };
            }
        } else {
            const products = await Product.find({ _id: { $in: arrOfId } })
                .populate("category")
                .sort(sortConfig)
                .lean()
                .catch((error) => {
                    const newError = new Error("물품 데이터를 가져오던 중 오류가 발생했습니다.");
                    newError.status = 500;
                    throw newError;
                });
            if (products.length === 0) {
                const error = new Error("찾으려는 물품이 존재하지 않습니다.");
                error.status = 404;
                throw error;
            } else {
                return { products };
            }
        }
    }

    /**
     * 카테고리(category)에 따른 물품 하나 이상을 반환
     *
     * @param category {String} 카테고리 값
     * @param {Object} pageData { page(페이지), perPage(페이지 당 데이터 수), orderBy(정렬 기준), orderDirection(정렬 순서) }
     * @return {[Product]} 하나 이상의 모델 객체가 들어간 배열
     */
    async getProductsByCategory(category, pageData) {
        const { limit, offset, orderBy, totalPage, sortConfig } = await getFormatPageData(pageData);

        if (orderBy && !allowedFieldMap[orderBy]) {
            const error = new Error("지원하지 않는 필드입니다.");
            error.status = 404;
            throw error;
        }

        if ((pageData.perPage !== undefined && pageData.perPage !== null) || (pageData.page !== undefined && pageData.page !== null)) {
            const matchCategoryData = await Category.findOne({ categoryName: category })
                .lean()
                .catch((error) => {
                    const newError = new Error("카테고리 데이터를 가져오던 중 오류가 발생했습니다.");
                    newError.status = 500;
                    throw newError;
                });
            if (matchCategoryData === undefined || matchCategoryData === null) {
                const error = new Error("해당 카테고리는 존재하지 않습니다.");
                error.status = 404;
                return error;
            } else {
                const products = await Product.find({ category: { $in: [].concat(matchCategoryData._id) } })
                    .populate("category")
                    .sort(sortConfig)
                    .skip(offset)
                    .limit(limit)
                    .lean()
                    .catch((error) => {
                        const newError = new Error("물품 데이터를 가져오던 중 오류가 발생했습니다.");
                        newError.status = 500;
                        throw newError;
                    });
                if (products.length === 0) {
                    const error = new Error("해당 페이지가 존재하지 않습니다.");
                    error.status = 404;
                    throw error;
                }
                return { products, totalPage };
            }
        } else {
            const matchCategoryData = await Category.findOne({ categoryName: category })
                .lean()
                .catch((error) => {
                    const newError = new Error("카테고리 데이터를 가져오던 중 오류가 발생했습니다.");
                    newError.status = 500;
                    throw newError;
                });
            if (matchCategoryData === undefined || matchCategoryData === null) {
                const error = new Error("해당 카테고리는 존재하지 않습니다.");
                error.status = 404;
                return error;
            } else {
                const products = await Product.find({ category: { $in: [].concat(matchCategoryData._id) } })
                    .populate("category")
                    .sort(sortConfig)
                    .lean()
                    .catch((error) => {
                        const newError = new Error("물품 데이터를 가져오던 중 오류가 발생했습니다.");
                        newError.status = 500;
                        throw newError;
                    });
                return { products };
            }
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
            const error = new Error("상품을 찾을 수 없습니다.");
            error.status = 404;
            return error;
        }

        const option = await Option.findById(optionId).lean();
        if (!option) {
            const error = new Error("옵션을 찾을 수 없습니다.");
            error.status = 404;
            return error;
        }

        product.option.push(option);
        //console.log("정상적으로 상품에 옵션 객체를 연결하였습니다.")
        await product.save();
        //console.log("정상적으로 상품이 저장되었습니다.")
        return product;
    }

    async checkProductExists(name) {
        const existingProduct = await Product.findOne({ name });

        return existingProduct;
    }

    async createProduct({ validInfoOfProductInput }) {
        const productData = validInfoOfProductInput;

        if (productData.category !== undefined && productData.category !== null) {
            productData.category = await Category.find({ categoryName: { $in: productData.category } });
        }

        const category = await Category.findOne({ categoryName: productData.category });
        const option = new Option({
            size: productData.option.size,
            color: productData.option.color
        });

        if (productData.file !== undefined && productData.file !== null) {
            productData.file = new File({
                name: productData.file.name,
                path: productData.file.path,
            });
        }

        const newProduct = await Product.create(productData).catch((error) => {
            const newError = new Error("물품 데이터를 생성하던 중 오류가 발생했습니다.");
            newError.status = 500;
            throw newError;
        });

        return newProduct;
    }

    async updateProduct(id, data) {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(id, data, {
                new: true,
            });

            return updatedProduct;
        } catch (err) {
            throw err;
        }
    }

    async deleteProduct(id) {
        try {
            const objectId = new mongoose.Types.ObjectId(id);

            const deleteProduct = await Product.deleteOne({ _id: objectId });

            if (deleteProduct.deletedCount > 0) {
                return {
                    success: true,
                    message: "제품이 성공적으로 삭제되었습니다.",
                    data: deleteProduct,
                };
            } else {
                return {
                    success: false,
                    message: "해당 ID의 상품을 찾을 수 없습니다.",
                };
            }
        } catch (err) {
            throw err;
        }
    }

    async pagination(pageData) {
        const limit = pageData.perPage ?? 3;
        const page = pageData.page ?? 1;
        const offset = limit * (page - 1);
        const orderBy = pageData.orderBy ?? "_id";
        const orderDirection = pageData.orderDirection ?? -1;
        const total = await Product.countDocuments();
        const totalPage = Math.ceil(total / limit);

        if (orderBy && !allowedFieldMap[orderBy]) {
            const error = new Error("지원하지 않는 필드입니다.");
            error.status = 404;
            throw error;
        }

        const sortConfig = orderBy !== undefined && orderBy !== null ? { [orderBy]: orderDirection ?? -1 } : { _id: 1 };

        if (offset !== undefined && offset !== null && limit !== undefined && limit !== null) {
            //console.log("여기들어옴");
            const result = await Product.find({}).sort(sortConfig).skip(offset).limit(limit).lean();
            return { offset, orderBy, orderDirection, result, totalPage };
        }
        //console.log("놉 여기임");
        return await Product.find({}).sort(sortConfig).lean();
    }
}

module.exports = new ProductService();
