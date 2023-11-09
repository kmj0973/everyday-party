function authenticatePageData(req, res, next) {
    const { page, perPage, orderBy, orderDirection } = req.query;

    if (page !== undefined && page !== null) {
        if (isNaN(Number(page))) {
            const error = new Error("페이지 값이 유효하지 않습니다.");
            error.status = 400;
            return next(error);
        }

        if (Number(page) <= 0) {
            const error = new Error("페이지 값이 유효하지 않습니다.");
            error.status = 400;
            return next(error);
        }
    }

    if (perPage !== undefined && perPage !== null) {
        if (isNaN(Number(perPage))) {
            const error = new Error("페이지 값이 유효하지 않습니다.");
            error.status = 400;
            return next(error);
        }

        if (Number(perPage) <= 0) {
            const error = new Error("페이지 값이 유효하지 않습니다.");
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
        if (isNaN(Number(orderDirection))) {
            const error = new Error("정렬 순서 값이 유효하지 않습니다.");
            error.status = 400;
            return next(error);
        }

        if (Number(orderDirection) !== -1 && Number(orderDirection) !== 1) {
            const error = new Error("정렬 순서 값이 유효하지 않습니다.");
            error.status = 400;
            return next(error);
        }
    }

    next();
}

module.exports = authenticatePageData;
