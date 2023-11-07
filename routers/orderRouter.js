const { Router } = require("express");
const { Order, ProductInfo } = require("../models");
const { Product, Option } = require("../models");

const OrderService = require("../services/orderService");
const orderService = require("../services/orderService");

const orderRouter = Router();

//주무내역 + 특정 주문 내역
orderRouter.get("/", async (req, res, next) => {
    try {
        const { id } = req.query;

        

        console.log(id);

        if (id === undefined) {
            // 모든 주문 조회
            const orderlist = await Order.find({});
            res.status(200).json({ orderlist });
        } else {
            console.log('부분 조회를 진입하였습니다.')

            // 특정 아이디로 주문 조회
            const oneOrder = await Order.findOne({ _id: id }); // 아이디를 기준으로 조회
            if (oneOrder) {
                console.log('부분 조회를 성공하였습니다.')
                res.status(200).json({ order: oneOrder, paginatedProducts });
            } else {
                res.status(404).json({ message: '해당 주문을 찾을 수 없습니다.' });
            }
        }
    } catch (err) {
        next(err);
    }
});

//주문 생성
orderRouter.post('/', async (req, res, next) => {
    const { orderedAt, totalPrice, orderedBy, phoneNumber, address, products, deliveryStatus } = req.body;
    try {

        const productInfos = [];

        for (const productInfo of products) {
            // 사용자로부터 받은 제품 아이디를 사용하여 ProductInfo 모델에서 제품 정보를 가져옴
            const productInfoModel = await Product.findById({ _id: productInfo.product });

            console.log(productInfoModel);

            if (productInfoModel === undefined) {
                // 해당 제품 아이디에 대한 정보를 찾을 수 없는 경우 예외 처리 또는 에러 처리를 수행하실 수 있습니다.
                throw new Error(`Product with ID ${productInfo.product} not found.`);
            }

            // 제품 정보를 포함한 객체를 products 배열에 추가
            productInfos.push({
                product : productInfoModel,
                count: productInfo.count, 
            });
        }


        const newOrder = await OrderService.createOrder({
            orderedAt,
            totalPrice,
            orderedBy,
            phoneNumber,
            address,
            products : productInfos,
            deliveryStatus
        })

        //console.log("주문이 완료되었습니다.")
        // res.status(201).json({
        //     message: "주문이 완료되었습니다.",
        //     newOrder,
        // });

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

    const { changedStatus } = req.body;
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
