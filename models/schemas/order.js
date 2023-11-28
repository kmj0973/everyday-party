const { Schema } = require("mongoose");
const { productInfoSchema } = require("./product.js");

const deliveryStatusEnum = ["주문완료", "배송준비", "배송중", "배송완료", "주문취소"];

const orderSchema = new Schema({
    orderedAt: {
        type: Date,
        required: true,
        default: new Date(),
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    orderedBy: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
    },
    address: {
        type: [String],
        required: true,
    }, // ['주소', '상세주소']의 형태로 저장
    products: {
        type: [productInfoSchema],
        required: true,
    },
    deliveryStatus: {
        type: String,
        required: true,
        enum: deliveryStatusEnum,
        default: "주문완료",
    },
});

module.exports = { orderSchema, productInfoSchema };
