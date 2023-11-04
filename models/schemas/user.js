const { Schema } = require("mongoose");

const UserSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    grade: {
        type: String,
        required: true,
        default: "user",
    },
    email: {
        type: String,
        unique: true,
    },
    name: {
        type: String,
    },
    address: {
        type: [String],
        default: undefined,
    },
    phone: {
        type: String,
        unique: true,
    },
    birthday: {
        type: Date,
    },
});

module.exports = UserSchema;
