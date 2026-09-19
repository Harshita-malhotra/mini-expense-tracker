import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/expenses";

function App() {
    const [expenseRows, setExpenseRows] = useState([]);
    const [summaryRows, setSummaryRows] = useState([]);

    const [expenseTitle, setExpenseTitle] = useState("");
    const [expenseAmount, setExpenseAmount] = useState("");
    const [expenseCategory, setExpenseCategory] = useState("food");

    const [chosenCategory, setChosenCategory] = useState("all");

    const [isLoading, setIsLoading] = useState(true);
    const [errorText, setErrorText] = useState("");

    const loadExpenses = async () => {
        try {
            setIsLoading(true);
            setErrorText("");

            let requestUrl = API_URL;

            if (chosenCategory !== "all") {
                requestUrl += `?category=${chosenCategory}`;
            }

            const response = await fetch(requestUrl);

            if (!response.ok) {
                throw new Error("Could not load expenses");
            }

            const data = await response.json();
            setExpenseRows(data);
        } catch (error) {
            setErrorText(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const loadSummary = async () => {
        try {
            const response = await fetch(`${API_URL}/summary`);

            if (!response.ok) {
                throw new Error("Could not load summary");
            }

            const data = await response.json();
            setSummaryRows(data);
        } catch (error) {
            setErrorText(error.message);
        }
    };

    useEffect(() => {
        loadExpenses();
        loadSummary();
    }, [chosenCategory]);

    const submitExpense = async (event) => {
        event.preventDefault();

        try {
            setErrorText("");

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: expenseTitle,
                    amount: Number(expenseAmount),
                    category: expenseCategory
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Could not add expense");
            }

            setExpenseTitle("");
            setExpenseAmount("");
            setExpenseCategory("food");

            await loadExpenses();
            await loadSummary();
        } catch (error) {
            setErrorText(error.message);
        }
    };

    const removeExpense = async (expenseId) => {
        try {
            setErrorText("");

            const response = await fetch(`${API_URL}/${expenseId}`, {
                method: "DELETE"
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Could not delete expense");
            }

            await loadExpenses();
            await loadSummary();
        } catch (error) {
            setErrorText(error.message);
        }
    };

    const grandTotal = summaryRows.reduce(
        (total, item) => total + item.total,
        0
    );

    return (
        <div className="page">
            <h1>Mini Expense Tracker</h1>

            <section className="box">
                <h2>Add Expense</h2>

                <form onSubmit={submitExpense} className="expense-form">
                    <input
                        type="text"
                        placeholder="Title"
                        value={expenseTitle}
                        onChange={(event) =>
                            setExpenseTitle(event.target.value)
                        }
                    />

                    <input
                        type="number"
                        placeholder="Amount"
                        value={expenseAmount}
                        onChange={(event) =>
                            setExpenseAmount(event.target.value)
                        }
                    />

                    <select
                        value={expenseCategory}
                        onChange={(event) =>
                            setExpenseCategory(event.target.value)
                        }
                    >
                        <option value="food">Food</option>
                        <option value="travel">Travel</option>
                        <option value="bills">Bills</option>
                        <option value="shopping">Shopping</option>
                        <option value="other">Other</option>
                    </select>

                    <button type="submit">Add Expense</button>
                </form>
            </section>

            {errorText && (
                <p className="error-message">{errorText}</p>
            )}

            <section className="box">
                <label>Filter by category: </label>

                <select
                    value={chosenCategory}
                    onChange={(event) =>
                        setChosenCategory(event.target.value)
                    }
                >
                    <option value="all">All</option>
                    <option value="food">Food</option>
                    <option value="travel">Travel</option>
                    <option value="bills">Bills</option>
                    <option value="shopping">Shopping</option>
                    <option value="other">Other</option>
                </select>
            </section>

            <section className="box">
                <h2>Expenses</h2>

                {isLoading ? (
                    <p>Loading...</p>
                ) : expenseRows.length === 0 ? (
                    <p>No expenses yet</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Amount</th>
                                <th>Category</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {expenseRows.map((expense) => (
                                <tr key={expense._id}>
                                    <td>{expense.title}</td>
                                    <td>₹{expense.amount}</td>
                                    <td>{expense.category}</td>
                                    <td>
                                        {new Date(
                                            expense.createdAt
                                        ).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() =>
                                                removeExpense(expense._id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>

            <section className="box">
                <h2>Summary</h2>

                {summaryRows.map((item) => (
                    <p key={item.category}>
                        <strong>{item.category}:</strong> ₹{item.total}
                    </p>
                ))}

                <h3>Grand Total: ₹{grandTotal}</h3>
            </section>
        </div>
    );
}

export default App;