const { Router } = require("express");
const { Order } = require("../models");

const OrderService = require("../services/orderService");

const orderRouter = Router();

//주무내역 + 특정 주문 내역
orderRouter.get("/", async (req, res, next) => {
    //console.log('주문 조회 라우터에 들어왔습니다.');
    try {
        const orderlist = await Order.find({});
        //주문 내역이 없으면 알아서 빈배열을 줌

        res.status(200).json({ orderlist });
    } catch (err) {
        const error = new Error("주문 내역을 불러오지 못하였습니다.");
        error.status = 500;
        return next(error);
    }
});

//주문생성
orderRouter.post("/", async (req, res, next) => {
    //console.log('주문 라우터에 들어왔습니다.');

    const { orderedAt, totalPrice, orderBy, phoneNumber, addresses, products, deliveryStatus } = req.body;

    //const data = req.body;
    //console.log(data);

    try {
        const newOrder = OrderService.createOrder({
            orderedAt,
            totalPrice,
            orderBy,
            phoneNumber,
            addresses,
            products,
            deliveryStatus,
        });

        //console.log("주문이 완료되었습니다.")
        res.status(201).json({
            message: "주문이 완료되었습니다.",
            newOrder,
        });
    } catch (err) {
        next(err);
        return;
    }
});

//주문 취소 -> 배송상태만 업데이트
orderRouter.patch("/:id", async (req, res, next) => {
    const { id } = req.params;
    //console.log(orderId);

//주문 취소 -> 배송상태만 업데이트
orderRouter.patch('/:id', async (req, res, next) => {
    const {id} = req.params;
    console.log(id);
    
    const  changedStatus  = req.body;

    //console.log(req.body);

    try {
        //service코드 넣기
        const orderCancellation = await OrderService.cancelOrder(
            id, changedStatus);

        res.status(200).json({ orderCancellation });
    } catch (err) {
        next(err);
    }
});

//주문 삭제 -> admin만 할 수 있는
// orderRouter.delete('/:id', async (req, res, next) => {
//     //console.log("주문 내역 삭제에 들어왔습니다.");
//     try {
//         const id = req.params;
//         //service코드 넣기
//         await Order.deleteOne(id);
//         res.status(204).json({ result : 'success'});
//     } catch (err) {
//         next(err);
//     }

// })

module.exports = orderRouter;
