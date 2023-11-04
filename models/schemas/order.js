const { Schema } = require("mongoose");

const ProductInfoSchema = new Schema({
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

const OrderSchema = new Schema({
    // method: {
    //     type: String,
    //     enum: ["Card", "Cash"],
    //     required: true,
    // },
    orderDate: {
        type: Date,
        required: true,
    },
    totalPrice: {
        type: Number,
        require: true
    },
    receiverName: {
        type: String,
        required: true,
    },
    receiverPhone: {
        type: String,
    },
    receiverAddress: {
        type: [String],
        required: true,
    },
    // orderCustomer: {
    //     type: Schema.Types.ObjectId,
    //     ref: "User",
    //     required: true,
    // },
    productInfo: {
        type: [ProductInfoSchema],
        required: true,
    },
    deliverStatus: {
        type: String,
        required: true,
    },
});

module.exports = OrderSchema;
