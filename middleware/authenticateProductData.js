function authenticateProductData(req, res, next) {
    const { name, price, stockedAt, discountRate, category, description, option } = req.body;

    if (name !== null && name !== undefined) {
        if (typeof name !== "string") {
            const error = new Error("이름 값이 유효하지 않습니다.");
            error.status = 400;
            return next(error);
        }
    }

    if (price !== null && price !== undefined) {
        if (isNaN(parseInt(price))) {
            const error = new Error("가격 값이 유효하지 않습니다.");
            error.status = 400;
            return next(error);
        }
    }

    if (stockedAt !== null && stockedAt !== undefined) {
        if (isNaN(parseInt(stockedAt))) {
            const error = new Error("입고일 값이 유효하지 않습니다.");
            error.status = 400;
            return next(error);
        }
    }

    if (discountRate !== null && discountRate !== undefined) {
        if (isNaN(parseInt(discountRate))) {
            const error = new Error("할인율 값이 유효하지 않습니다.");
            error.status = 400;
            return next(error);
        }

        if (Number(discountRate) < 0 || Number(discountRate) > 1) {
            const error = new Error("할인율 값이 유효하지 않습니다.");
            error.status = 400;
            return next(error);
        }
    }

    if (category !== null && category !== undefined) {
        if (!Array.isArray(category)) {
            const error = new Error("카테고리 값이 유효하지 않습니다.");
            error.status = 400;
            return next(error);
        }

        category.forEach((eachCategory) => {
            if (typeof eachCategory !== "string") {
                const error = new Error("카테고리 값이 유효하지 않습니다.");
                error.status = 400;
                return next(error);
            }
        });
    }

    if (description !== null && description !== undefined) {
        if (typeof description !== "string") {
            const error = new Error("설명 값이 유효하지 않습니다.");
            error.status = 400;
            return next(error);
        }
    }

    if (option !== null && option !== undefined) {
        console.log(Object.prototype.toString.call(option));
        if (Object.prototype.toString.call(option).slice(8, -1) !== "Object") {
            const error = new Error("옵션 값이 유효하지 않습니다.");
            error.status = 400;
            return next(error);
        }

        for ([key, eachOption] in Object.entries(option)) {
            if (eachOption !== undefined && eachOption !== null) {
                if (Array.isArray(eachOption)) {
                    const error = new Error("옵션 값이 유효하지 않습니다.");
                    error.status = 400;
                    return next(error);
                }

                eachOption.forEach((valueOfEachOption) => {
                    if (typeof valueOfEachOption !== "string") {
                        const error = new Error("옵션 값이 유효하지 않습니다.");
                        error.status = 400;
                        return next(error);
                    }
                });
            }
        }
    }

    next();
}

module.exports = authenticateProductData;
