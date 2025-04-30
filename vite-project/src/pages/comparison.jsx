import React, { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import "./Comparison.css";

const Comparison = () => {
    const [monthlyIncomeData, setMonthlyIncomeData] = useState([]);
    const [monthlyExpenseData, setMonthlyExpenseData] = useState([]);
    const [comparisonData, setComparisonData] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [availableYears, setAvailableYears] = useState([]);

    useEffect(() => {
        fetchData();
    }, [selectedYear]);

    const fetchData = async () => {
        try {
            const incomeRes = await fetch("https://devionx-expensetracker.onrender.com/gettransactions");
            const expenseRes = await fetch("https://devionx-expensetracker.onrender.com/getdebit");

            const incomeData = await incomeRes.json();
            const expenseData = await expenseRes.json();

            if (incomeData.success && expenseData.success) {
                const yearsSet = new Set();

                incomeData.transactions.forEach((txn) => yearsSet.add(new Date(txn.date).getFullYear()));
                expenseData.transactions.forEach((txn) => yearsSet.add(new Date(txn.date).getFullYear()));

                const yearsArray = Array.from(yearsSet).sort((a, b) => b - a);
                setAvailableYears(yearsArray);

                generateMonthlyIncome(incomeData.transactions, selectedYear);
                generateMonthlyExpense(expenseData.transactions, selectedYear);
            }
        } catch (err) {
            console.error("Error fetching data", err);
        }
    };

    const generateMonthlyIncome = (transactions, year) => {
        const map = {};
        transactions.forEach((txn) => {
            const date = new Date(txn.date);
            if (txn.type === "CREDIT" && date.getFullYear() === Number(year)) {
                const label = `${date.toLocaleString("default", { month: "short" })} ${year}`;
                map[label] = (map[label] || 0) + txn.amount;
            }
        });

        const sorted = Object.entries(map)
            .map(([monthYear, amount]) => {
                const [month, yearStr] = monthYear.split(" ");
                const sortKey = new Date(`${month} 1, ${yearStr}`).getTime();
                return { month: monthYear, income: amount, sortKey };
            })
            .sort((a, b) => a.sortKey - b.sortKey)
            .map(({ month, income }) => ({ month, income }));

        setMonthlyIncomeData(sorted);
    };

    const generateMonthlyExpense = (transactions, year) => {
        const map = {};
        transactions.forEach((txn) => {
            const date = new Date(txn.date);
            if (txn.type === "DEBIT" && date.getFullYear() === Number(year)) {
                const label = `${date.toLocaleString("default", { month: "short" })} ${year}`;
                map[label] = (map[label] || 0) + txn.amount;
            }
        });

        const sorted = Object.entries(map)
            .map(([monthYear, amount]) => {
                const [month, yearStr] = monthYear.split(" ");
                const sortKey = new Date(`${month} 1, ${yearStr}`).getTime();
                return { month: monthYear, expense: amount, sortKey };
            })
            .sort((a, b) => a.sortKey - b.sortKey)
            .map(({ month, expense }) => ({ month, expense }));

        setMonthlyExpenseData(sorted);
    };

    useEffect(() => {
        mergeIncomeAndExpense();
    }, [monthlyIncomeData, monthlyExpenseData]);

    const mergeIncomeAndExpense = () => {
        const merged = {};

        monthlyIncomeData.forEach(({ month, income }) => {
            merged[month] = { month, income, expense: 0 };
        });

        monthlyExpenseData.forEach(({ month, expense }) => {
            if (merged[month]) {
                merged[month].expense = expense;
            } else {
                merged[month] = { month, income: 0, expense };
            }
        });

        const mergedArray = Object.values(merged).sort((a, b) => {
            const getDate = (str) => new Date(`${str.split(" ")[0]} 1, ${str.split(" ")[1]}`);
            return getDate(a.month) - getDate(b.month);
        });

        setComparisonData(mergedArray);
    };

    return (
        <div className="comparison-container">
            <h2 className="comparison-title">Income vs Expense Comparison</h2>

            <div className="year-selector">
                <label>Select Year: </label>
                <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                    {availableYears.map((year) => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>

            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month"
                        height={60}
                        style={{ fontSize: 10 }}
                        interval={0}
                        angle={-45}
                        textAnchor="end" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="income" fill="#27ae60" name="Income" animationDuration={1000}
                        barSize={25} />
                    <Bar dataKey="expense" fill="#c0392b" name="Expense" animationDuration={1000}
                        barSize={25} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Comparison;
