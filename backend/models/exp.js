const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 2
    },

    amount: {
        type: Number,
        required: true,
        min: 0.01
    },

    category: {
        type: String,
        required: true,
        enum: ["food", "travel", "bills", "shopping", "other"]
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Expense", expenseSchema);