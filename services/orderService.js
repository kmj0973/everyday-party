const { Order } = require("../models/index");
const mongoose = require("mongoose");

class OrderService {
    constructor() {}

    /**
     * 주문 내역 생성
     *
     * @param 받아온 orderData 객체
     * @return 생성된 orderData 객체
     */
    async createOrder(orderData) {
        const newOrder = await Order.create(orderData);
        return newOrder;
    }

    /**
     * 주문 취소 진행해서 저장하는 함수
     *
     * @param (orderId, deliveryStatus) 사용자 아이디와 배송상태
     * @return
     */
    async cancelOrder(id, totalPrice, changeStatus) {
        const order = await Order.findByIdAndUpdate(
            id,
            {
                $set: {
                    deliveryStatus: changeStatus,
                    totalPrice: totalPrice,
                },
            },
            { new: true, runValidators: true },
        ).lean();

        //console.log(order);

        if (!order) {
            throw new Error("주문을 찾을 수 없습니다.");
        }
        return order;
    }

    // Define the deleteOrder function
    async deleteOrder(id) {
        try {
            const objectId = new mongoose.Types.ObjectId(id);
            const deleteOrder = await Order.deleteOne({ _id: objectId });

            if (deleteOrder.deletedCount > 0) {
                return {
                    success: true,
                    message: "주문이 성공적으로 삭제되었습니다.",
                };
            } else {
                return {
                    success: false,
                    message: "해당 주문을 찾을 수 없습니다.",
                };
            }
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new OrderService();
