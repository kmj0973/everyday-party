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
    orderCustomer: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    productInfo: {
        type: [ProductInfoSchema],
        required: true,
    },
    deliverState: {
        type: String,
        required: true,
    },
});

module.exports = OrderSchema;
