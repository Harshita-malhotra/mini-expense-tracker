const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const expenseRoutes = require("./routes/expenseR");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/expenses", expenseRoutes);
app.get("/", (req, res) => {
    res.json({
        message: "Expense Tracker API running"
    });
});
const PORT = process.env.PORT || 5000;
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });