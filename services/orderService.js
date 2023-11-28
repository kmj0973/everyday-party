const { Order } = require("../models/index.js");

class OrderService {
    /**
     * 컬렉션 내 모든 주문 데이터 반환
     *
     * @return {[Order]} DB에 저장된 모든 Order 객체 데이터 배열 혹은 빈 배열
     */
    static async getAllOrders() {
        const allOrders = await Order.find({}).catch((error) => {
            const newError = new Error("주문 데이터를 가져오던 중 오류가 발생했습니다.");
            newError.status = 500;
            newError.cause = error;
            throw newError;
        });
        return allOrders;
    }

    /**
     * 컬렉션 내 모든 주문 데이터 반환
     *
     * @param {string} id 주문 데이터의 고유 아이디
     * @return {[Order]} DB에 저장된 모든 Order 객체 데이터 배열 혹은 빈 배열
     */
    static async getOrderById(id) {
        const order = await Order.findById(id)
            .populate("products.product")
            .lean()
            .catch((error) => {
                const newError = new Error("주문 데이터를 가져오던 중 오류가 발생했습니다.");
                newError.status = 500;
                newError.cause = error;
                throw newError;
            });

        if (order === null || order === undefined) {
            const error = new Error("찾으려는 주문이 존재하지 않습니다.");
            error.status = 404;
            throw error;
        }

        return order;
    }

    /**
     * 주문 내역 생성
     *
     * @param {Object} 받아온 orderData 객체
     * @return {Object} 생성된 orderData 객체
     */
    static async createOrder(orderData) {
        const newOrder = await Order.create(orderData).catch((error) => {
            const newError = new Error("주문 데이터를 생성하던 중 오류가 발생했습니다.");
            newError.status = 500;
            newError.cause = error;
            throw newError;
        });
        return newOrder.toObject();
    }

    /**
     * 주문 취소 진행해서 저장하는 함수
     *
     * @param id 주문 데이터의 고유 아이디
     * @param changeStatus 업데이트 하려는 주문 데이터 (주문 상태)
     * @return {Order} 업데이트된 주문 객체 데이터
     */
    static async cancelOrder(id, changeStatus) {
        const order = await Order.findByIdAndUpdate(
            id,
            {
                $set: {
                    deliveryStatus: changeStatus,
                },
            },
            { new: true, runValidators: true },
        ).lean();

        if (order !== undefined && order !== null) {
            const newError = new Error("주문 데이터를 생성하던 중 오류가 발생했습니다.");
            newError.status = 404;
            throw newError;
        }

        return order;
    }

    /**
     * 주문 취소 진행해서 저장하는 함수
     *
     * @param id 주문 데이터의 고유 아이디
     * @return {Order} 삭제된 주문 객체 데이터
     */
    static async deleteOrder(id) {
        const deletedOrder = await Order.findByIdAndDelete(id);

        if (deletedOrder.deletedCount <= 0) {
            const newError = new Error("해당 주문을 찾을 수 없습니다.");
            newError.status = 404;
            throw newError;
        }

        return deletedOrder;
    }
}

module.exports = OrderService;
