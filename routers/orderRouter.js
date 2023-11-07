const { Router } = require("express");
const { Order } = require("../models");

const OrderService = require("../services/orderService");

const orderRouter = Router();

//주무내역 + 특정 주문 내역
orderRouter.get("/", async (req, res, next) => {
    //console.log('주문 조회 라우터에 들어왔습니다.');
    try {
        const orderlist = await Order.find({});

        res.status(200).json({ orderlist });
    } catch (err) {
        const error = new Error("주문 내역을 불러오지 못하였습니다.");
        error.status = 500;
        return next(error);
    }
});

//주문생성

orderRouter.post('/', async (req, res, next) => {
    const { orderedAt, totalPrice, orderedBy, phoneNumber, address, products, deliveryStatus } = req.body;
    try {
        const newOrder = OrderService.createOrder({
            orderedAt,
            totalPrice,
            orderedBy,
            phoneNumber,
            address,
            products,
            deliveryStatus
        })


        //console.log("주문이 완료되었습니다.")
        res.status(201).json({
            message: "주문이 완료되었습니다.",
            newOrder,
        });

        if (newOrder) {
            res.status(201).json({
                message: "주문이 완료되었습니다.",
                newOrder,
            });
        } else {
            res.status(500).json({
                message: "주문을 생성하는 중에 문제가 발생했습니다.",
            });
        }
    } catch (err) {
        next(err);
        return;
    }
});

//주문 취소 -> 배송상태만 업데이트
orderRouter.patch("/:id", async (req, res, next) => {
    const { id } = req.params;

    const { deliveryStatus } = req.body;

    const { totalPrice, changedStatus } = req.body;
    console.log(totalPrice, changedStatus);
    try {
        const cancelledOrder = await OrderService.cancelOrder(id, totalPrice, changedStatus);

        res.status(200).json({
            cancelledOrder,
        });
    } catch (err) {
        next(err);
    }
});




//주문 삭제 -> 회원탈퇴 후 삭제할 때 사용
orderRouter.delete('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        if (id === undefined) {
            res.status(404).json({ message: '해당 상품의 아이디가 필요합니다.' });
            return;
        }

        const result = await OrderService.deleteOrder(id);

        if (result.success) {
            res.status(204).json({ message: result.message });
        } else {
            res.status(404).json({ message: result.message });
        }
    } catch (err) {
        next(err);
    }
});


module.exports = orderRouter;
