const { Order } = require("../models/index");

class OrderService {

    constructor() {}

    /**
     * 주문 내역 생성
     *
     * @param 받아온 orderData 객체
     * @return 생성된 orderData 객체
     */
    async createOrder (orderData) {
        const newOrder = await Order.create({orderData});
        return newOrder;
    }
    
    /**
     * 주문 취소 진행해서 저장하는 함수
     *
     * @param (orderId, deliveryStatus) 사용자 아이디와 배송상태
     * @return
     */
    async cancelOrder (id, changeStatus) {
 
        const order = await Order.findByIdAndUpdate(
            id,
            {
                deliveryStatus: changeStatus
            })

            //console.log(order);

        if (!order) {
          throw new Error('주문을 찾을 수 없습니다.');
        }
        return {order, changeStatus, message: "주문이 취소되었습니다."};
    }
}

module.exports = new OrderService();
