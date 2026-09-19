const express = require("express");
const mongoose = require("mongoose");
const Expense = require("../models/exp");
const router = express.Router();
router.post("/", async (req, res) => {
    try {
        const { title, amount, category } = req.body;

        const expense = await Expense.create({
            title,
            amount,
            category
        });

        res.status(201).json(expense);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

router.get("/", async (req, res) => {
    try {
        const { category } = req.query;

        const filter = {};

        if (category) {
            filter.category = category;
        }

        const expenses = await Expense.find(filter)
            .sort({ createdAt: -1 });

        res.json(expenses);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch expenses"
        });
    }
});

router.get("/summary", async (req, res) => {
    try {
        const summary = await Expense.aggregate([
            {
                $group: {
                    _id: "$category",
                    total: {
                        $sum: "$amount"
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    total: 1
                }
            }
        ]);

        res.json(summary);
    } catch (error) {
        res.status(500).json({
            message: "Failed to generate summary"
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        const expense = await Expense.findByIdAndDelete(id);

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.json({
            message: "Expense deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete expense"
        });
    }
});
module.exports = router;