function authenticatePageData(req, res, next) {
    const { page, perPage, orderBy, orderDirection } = req.query;

    if (page !== undefined && page !== null) {
        if (Number.isNaN(page)) {
            const error = new Error("페이지 값이 유효하지 않습니다.");
            error.status = 400;
            return next(error);
        }

        if (Number(page) <= 0) {
            const error = new Error("페이지 값은 0 이상의 값이어야 합니다.");
            error.status = 400;
            return next(error);
        }
    }

    if (perPage !== undefined && perPage !== null) {
        if (Number.isNaN(perPage)) {
            const error = new Error("페이지 값이 유효하지 않습니다.");
            error.status = 400;
            return next(error);
        }

        if (Number(perPage) <= 0) {
            const error = new Error("페이지 값은 0 이상의 값이어야 합니다.");
            error.status = 400;
            return next(error);
        }
    }

    if (orderBy !== undefined && orderBy !== null) {
        if (typeof orderBy !== "string") {
            const error = new Error("정렬 기준 값이 유효하지 않습니다.");
            error.status = 400;
            return next(error);
        }
    }

    if (orderDirection !== undefined && orderDirection !== null) {
        if (Number.isNaN(orderDirection)) {
            const error = new Error("정렬 순서 값이 유효하지 않습니다.");
            error.status = 400;
            return next(error);
        }

        if (Number(orderDirection) !== -1 && Number(orderDirection) !== 1) {
            const error = new Error("정렬 순서는 -1 또는 1 값을 가집니다.");
            error.status = 400;
            return next(error);
        }
    }

    return next();
}

module.exports = authenticatePageData;
