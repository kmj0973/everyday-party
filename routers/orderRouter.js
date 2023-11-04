const { Router } = require('express');
const { Order } = require('../models');

const orderRouter = Router();


//주무내역 + 특정 주문 내역 
orderRouter.get('/', async (req, res, next) => {
    console.log('주문 조회 라우터에 들어왔습니다.');
    try {
        const orderlist = await Order.find({});
        if (orderlist.length === 0) {
            // 주문이 없을 때
            return res.status(200).json({ message: '주문 내역이 없습니다.' });
        }
        res.json({
            status: 200,
            orderlist});

    } catch (err) {
        res.json({ 
            status: 500,
            message: 'Internal Server Error' });
        next(err);
        return;
    }
});

//주문생성
orderRouter.post('/', async (req, res, next) => {
    console.log('주문 라우터에 들어왔습니다.');
    const { orderDate, totalPrice, receiverName, receiverPhone, receiverAddress,orderCustomer, productInfo, deliverStatus  } = req.body;

    //const data = req.body;
    //console.log(data);
    
    try {
        const newOrder = await Order.create({
            orderDate, totalPrice, receiverName, receiverPhone, receiverAddress,orderCustomer, productInfo, deliverStatus
        });
        console.log("주문이 완료되었습니다.")
        res.json( {
            status: 201,
            message : "주문이 완료되었습니다.",
            newOrder 
        });
    } catch (err) {
        next(err);
        return;
    }
})

//주문 수정1 -> 전체 내용을 업데이트
orderRouter.put('/:id', async (req, res, next) => {
    const orderId = req.params.id;
    
    const { orderDate, totalPrice, receiverName, receiverPhone, receiverAddress, productInfo, deliverStatus } = data;
    const data = req.body;
    //const data = req.body;
    //console.log(data);
    console.log('주문 수정 라우터에 들어왔습니다.');
    try {
        const order = await Order.findByIdAndUpdate(orderId, data);
        res.json( {
            status: 201,
            order 
        });
    } catch (err) {
        next(err);
    }

})
//주문 수정 1이나 2 중 하나만 선택해서 사용해도 될듯 -> 뭘로 할래용?

//주문 수정2 -> 부분 내용을 업데이트
orderRouter.patch('/:id', async (req, res, next) => {
    const orderId = req.params.id;
    
    const { orderDate, totalPrice, receiverName, receiverPhone, receiverAddress, productInfo, deliverStatus } = data;
    const data = req.body;
    //const data = req.body;
    //console.log(data);
    console.log('주문 수정 라우터에 들어왔습니다.');
    try {
        const order = await Order.findByIdAndUpdate(orderId, data);
        res.json( {
            status: 201,
            order 
        });
    } catch (err) {
        next(err);
    }
})



//주문 삭제
orderRouter.delete('/:id', async (req, res, next) => {
    console.log("주문 내역 삭제에 들어왔습니다.");
    try {
        const id = req.params;

        await Order.deleteOne(id);
        res.json({ result : 'success'});
    } catch (err) {
        next(err);
    }

})

module.exports = orderRouter;