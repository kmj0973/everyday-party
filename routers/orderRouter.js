const { Router } = require("express");
const { Order, ProductInfo, User } = require("../models");

const OrderService = require("../services/orderService");

const orderRouter = Router();

const { authenticateUserToken } = require("../middleware/index");

//주무내역 + 특정 주문 내역
orderRouter.get("/", async (req, res, next) => {
    try {
        const { id } = req.query;

        if (id === undefined) {
            // 모든 주문 조회
            const orderlist = await Order.find({});
            res.status(200).json({ orderlist });
        } else {
            // 특정 아이디로 주문 조회
            const oneOrder = await Order.findOne({ _id: id })//.populate("ProductInfo"); // 아이디를 기준으로 조회
            if (oneOrder) {
                //console.log('부분 조회를 성공하였습니다.')
                res.status(200).json({ order: oneOrder }).populate("products.product");;
            } else {
                res.status(404).json({
                    message: "해당 주문을 찾을 수 없습니다.",
                });
            }
        }
    } catch (err) {
        return next(err);
    }
});

//주문 생성
orderRouter.post("/", async (req, res, next) => {

    const id = req.header("id");
    //console.log(id);
    const { orderedAt, totalPrice, orderedBy, phoneNumber, address, products, deliveryStatus } = req.body;
    const user = await User.findById({ _id: id });
    const userAddress = user ? user.address : null;
    const userPhone = user ? user.phone : null;
    const userName = user ? user.name : null;
    const userId = user ? user.userId : null;


    //console.log(userAddress); 
    try {
        const newOrder = await OrderService.createOrder({
            orderedAt : new Date(),
            totalPrice,
            orderedBy : userId,
            phoneNumber: userPhone,
            address: userAddress,
            products,
            deliveryStatus,
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
        return next(err);
    }
});

//주문 취소 -> 배송상태만 업데이트
orderRouter.patch("/:id", authenticateUserToken, async (req, res, next) => {

    const  currentGrade  = req.user.grade;
    console.log(currentGrade);

    const { id } = req.params;

    const { changedStatus } = req.body;
    try {
        const cancelledOrder = await OrderService.cancelOrder(id, currentGrade, changedStatus);
        res.status(200).json({
            cancelledOrder,
        });
    } catch (err) {
        return next(err);
    }
});

//주문 삭제 -> 회원탈퇴 후 삭제할 때 사용
orderRouter.delete("/:id", authenticateUserToken, async (req, res, next) => {
    const  currentGrade  = req.user.grade;
    if(currentGrade !== "admin")
    {
        return res.status(403).json({ message: "관리자 외에 접근할 수 없습니다." });
    }
    try {
        const id = req.params.id;
        if (id === undefined) {
            res.status(404).json({
                message: "해당 상품의 아이디가 필요합니다.",
            });
            return;
        }

        const result = await OrderService.deleteOrder(id);

        if (result.success) {
            res.status(204).json({ message: result.message });
        } else {
            res.status(404).json({ message: result.message });
        }
    } catch (err) {
        return next(err);
    }
});

module.exports = orderRouter;
