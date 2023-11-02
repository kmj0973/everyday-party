const { Router } = require('express');
const { Order } = require('../models');

const orderRouter = Router();


//주무내역 + 특정 주문 내역 
orderRouter.get('/', async (req, res, next) => {
    console.log('주문 조회 라우텅에 들어왔습니다.');
    try {
        const orderlist = await Order.find({});
        res.json({orderlist});
    } catch (err) {
        next(err);
        return;
    }
});

//주문생성
orderRouter.post('/', async (req, res, next) => {
    const { name, price, discountRate, category, description, option, file } = req.body;
    //const data = req.body;
    //console.log(data);
    console.log('주문 라우터에 들어왔습니다.');
    try {
        const newOrder = await Order.create({
            name, 
            price
        });
        res.json( {
            status: 201,
            newOrder 
        });
    } catch (err) {
        next(err);
        return;
    }
})

//주문 수정
orderRouter.put('/:id', async (req, res, next) => {
    const { name, price, discountRate, category, description, option, file } = req.body;
    //const data = req.body;
    //console.log(data);
    console.log('주문 수정 라우터에 들어왔습니다.');
    try {
        const order = await Order.update({ name, price});
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