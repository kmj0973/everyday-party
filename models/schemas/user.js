const { Schema } = require("mongoose");

const userGradeEnum = ["user", "admin"];

const userSchema = new Schema({
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
        enum: userGradeEnum,
        default: "user",
    },
    email: {
        type: String,
    },
    name: {
        type: String,
    },
    address: {
        type: [String],
    },
    phone: {
        type: String,
    },
    birthday: {
        type: Date,
    },
});

module.exports = userSchema;
