const { Router } = require("express");

const orderService = require("../services/orderService.js");

const orderRouter = Router();

const { authenticateUserToken, isAdmin } = require("../middleware/index.js");
const UserService = require("../services/userService.js");

// 주문 내역 조회 (모든 내역, 특정 아이디)
orderRouter.get("/", async (req, res, next) => {
    try {
        const { id } = req.query;

        if (id === undefined || id === null) {
            // 모든 주문 조회
            const orderList = await orderService.getAllOrders();
            return res.status(200).json({ orderList });
        }
        // 특정 아이디로 주문 조회
        const oneOrder = await orderService.getOrderById(id); // 아이디를 기준으로 조회
        return res.status(200).json({ order: oneOrder });
    } catch (error) {
        return next(error);
    }
});

// 주문 생성
orderRouter.post("/", async (req, res, next) => {
    const { id } = req.headers;
    const { totalPrice, products, deliveryStatus } = req.body;
    const user = await UserService.getUserById(id);
    const [userAddress, userPhone, userId] = user !== null && user !== undefined ? [user.address, user.phone, user.userId] : [null, null, null];

    try {
        const newOrder = await orderService.createOrder({
            orderedAt: new Date(),
            totalPrice,
            orderedBy: userId,
            phoneNumber: userPhone,
            address: userAddress,
            products,
            deliveryStatus,
        });

        if (newOrder === undefined || newOrder === null) {
            const error = new Error("주문을 생성하는 중에 문제가 발생했습니다.");
            error.status = 500;
            return next(error);
        }

        return res.status(201).json({
            message: "주문이 완료되었습니다.",
            newOrder,
        });
    } catch (error) {
        return next(error);
    }
});

// 주문 취소 -> 배송상태만 업데이트
orderRouter.patch("/:id", authenticateUserToken, isAdmin, async (req, res, next) => {
    const { id } = req.params;
    const { changedStatus } = req.body;

    if (id === undefined || id === null) {
        const error = new Error("수정할 주문의 아이디를 제공해야 합니다.");
        error.status = 400;
        return next(error);
    }

    try {
        const cancelledOrder = await orderService.cancelOrder(id, changedStatus);
        return res.status(200).json({
            cancelledOrder,
        });
    } catch (error) {
        return next(error);
    }
});

// 주문 삭제 -> 회원탈퇴 후 삭제할 때 사용
orderRouter.delete("/:id", authenticateUserToken, isAdmin, async (req, res, next) => {
    const { id } = req.params;

    if (id === undefined || id === null) {
        const error = new Error("삭제할 주문의 아이디를 제공해야 합니다.");
        error.status = 400;
        return next(error);
    }
    try {
        const result = await orderService.deleteOrder(id);

        if (result !== undefined && result !== null) {
            return res.status(204).json({ message: result.message });
        }

        return res.status(404).json({ message: result.message });
    } catch (error) {
        return next(error);
    }
});

module.exports = orderRouter;
