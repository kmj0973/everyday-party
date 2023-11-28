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
        if (Number.isNaN(price)) {
            const error = new Error("가격 값이 유효하지 않습니다.");
            error.status = 400;
            return next(error);
        }

        if (Number(price) < 0) {
            const error = new Error("가격은 0원 이상이어야 합니다.");
            error.status = 400;
            return next(error);
        }
    }

    if (stockedAt !== null && stockedAt !== undefined) {
        if (Number.isNaN(Date.parse(stockedAt))) {
            const error = new Error("입고일 값이 유효하지 않습니다.");
            error.status = 400;
            return next(error);
        }
    }

    if (discountRate !== null && discountRate !== undefined) {
        if (Number.isNaN(discountRate)) {
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
        const parsedCategory = JSON.parse(category);
        if (!Array.isArray(parsedCategory)) {
            const error = new Error("카테고리 값이 유효하지 않습니다.");
            error.status = 400;
            return next(error);
        }

        const eachCategory = Object.values(parsedCategory);
        for (let eachCategoryIndex = 0; eachCategoryIndex < eachCategory.length; eachCategoryIndex += 1) {
            if (typeof eachCategory[eachCategoryIndex] !== "string") {
                const error = new Error("카테고리 값이 유효하지 않습니다.");
                error.status = 400;
                return next(error);
            }
        }
    }

    if (description !== null && description !== undefined) {
        if (typeof description !== "string") {
            const error = new Error("설명 값이 유효하지 않습니다.");
            error.status = 400;
            return next(error);
        }
    }

    if (option !== null && option !== undefined) {
        const parsedOption = JSON.parse(option);
        if (Object.prototype.toString.call(parsedOption).slice(8, -1) !== "Object") {
            const error = new Error("옵션 값이 유효하지 않습니다.");
            error.status = 400;
            return next(error);
        }

        const eachOption = Object.values(parsedOption);
        for (let optionIndex = 0; optionIndex < eachOption.length; optionIndex += 1) {
            if (!Array.isArray(eachOption[optionIndex])) {
                const error = new Error("옵션 값이 유효하지 않습니다.");
                error.status = 400;
                return next(error);
            }

            for (let eachOptionIndex = 0; eachOptionIndex < eachOption[optionIndex].length; eachOptionIndex += 1) {
                const valueOfEachOption = eachOption[optionIndex][eachOptionIndex];
                if (typeof valueOfEachOption !== "string") {
                    const error = new Error("옵션 값이 유효하지 않습니다.");
                    error.status = 400;
                    return next(error);
                }
            }
        }
    }

    return next();
}

module.exports = authenticateProductData;
