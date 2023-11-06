const { Schema } = require("mongoose");

const productInfoSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    count: {
        type: Number,
        required: true,
    },
});

const deliveryStatusEnum = ["주문 완료", "배송 준비", "배송 중", "배송 완료"];

const orderSchema = new Schema({
    // method: {
    //     type: String,
    //     enum: ["Card", "Cash"],
    //     required: true,
    // },
    orderedAt: {
        type: Date,
        required: true,
    }, 
    totalPrice: {
        type: Number,
        required: true
    },
    orderBy: {
        type: String,
        required: true,
        //default: "Anonymous",
    },
    phoneNumber: {
        type: String,
    },
    addresses: {
        type: [String],
        required: true,
    },
    // orderCustomer: {
    //     type: Schema.Types.ObjectId,
    //     ref: "User",
    //     required: true,
    // },
    products: {
        type: [productInfoSchema],
        required: true,
    },
    deliveryStatus: {
        type: String,
        required: true,
        enum : deliveryStatusEnum
    },
});

module.exports = {orderSchema};
