import React, {
    useState, useEffect, useMemo,
} from "react";
import "@assets/scss/index.scss";
import { paychecksApi } from "@/api/PaychecksApi.ts";
import type { Paycheck } from "@interfaces/models/PaychecksModel.ts";

interface MonthlyData {
    month: string;
    income: number;
    expenses: number;
}

interface CategoryData {
    category: string;
    amount: number;
    color: string;
}

export default function Analytics() {
    const [ paychecks, setPaychecks ] = useState<Paycheck[]>([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        fetchPaychecks();
    }, []);

    const fetchPaychecks = async() => {
        try {
            const res = await paychecksApi.getPaychecks();
            setPaychecks(res.paychecks);
        } catch (err) {
            console.error("Error fetching paychecks:", err);
        } finally {
            setLoading(false);
        }
    };

    // Process data for income/expense trend chart (last 6 months)
    const incomeExpenseData = useMemo<MonthlyData[]>(() => {
        if (!paychecks.length) {
            return [];
        }

        const months: { [key: string]: { income: number; expenses: number } } = {};
        const monthNames = [ "Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек" ];

        const now = new Date();
        const last6Months: Date[] = [];

        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            last6Months.push(date);
        }

        last6Months.forEach((date) => {
            const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
            months[key] = {
                income: 0,
                expenses: 0,
            };
        });

        paychecks.forEach((paycheck) => {
            if (!paycheck.pay_date) {
                return;
            }

            const date = new Date(paycheck.pay_date * 1000);
            const key = `${date.getFullYear()}-${date.getMonth() + 1}`;

            if (months[key]) {
                const price = paycheck.price || 0;

                if (paycheck.category === "Transfer") {
                    months[key].income += price;
                } else {
                    months[key].expenses += Math.abs(price);
                }
            }
        });

        return last6Months.map((date) => {
            const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
            const monthData = months[key];
            const monthName = monthNames[date.getMonth()];
            const year = date.getFullYear().toString().slice(2);

            return {
                month: `${monthName} '${year}`,
                income: monthData.income,
                expenses: monthData.expenses,
            };
        });
    }, [ paychecks ]);

    // Process data for category breakdown chart (current month)
    const categoryData = useMemo<CategoryData[]>(() => {
        if (!paychecks.length) {
            return [];
        }

        const now = new Date();
        const currentMonthKey = `${now.getFullYear()}-${now.getMonth() + 1}`;
        const categories: { [key: string]: number } = {};

        const colorMap: Record<string, string> = {
            "Cafe": "#FFB74D",
            "Transport": "#64B5F6",
            "Transfer": "#4DB6AC",
            "Utilities": "#81C784",
            "Healthcare": "#81C784",
            "Marketplace": "#7986CB",
            "Entertainment": "#FFD54F",
            "Shop": "#9575CD",
            "Other": "#F48FB1",
        };

        const categoryNames: Record<string, string> = {
            "Cafe": "Кафе",
            "Transport": "Транспорт",
            "Transfer": "Зарплата",
            "Utilities": "Коммуналка",
            "Healthcare": "Здоровье",
            "Marketplace": "Маркетплейс",
            "Entertainment": "Развлечения",
            "Shop": "Магазин",
            "Other": "Другое",
        };

        paychecks.forEach((paycheck) => {
            if (!paycheck.pay_date || paycheck.category === "Transfer") {
                return;
            }

            const date = new Date(paycheck.pay_date * 1000);
            const paycheckMonthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;

            if (paycheckMonthKey === currentMonthKey) {
                const category = categoryNames[paycheck.category] || paycheck.category;
                const price = Math.abs(paycheck.price || 0);

                categories[category] = (categories[category] || 0) + price;
            }
        });

        return Object.entries(categories)
            .map(([ category, amount ]) => ({
                category,
                amount,
                color: colorMap[paychecks.find((p) => categoryNames[p.category] === category)?.category || "Other"] || "#78909C",
            }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 6);
    }, [ paychecks ]);

    const formatMoney = (value: number) => {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M ₽`;
        }

        if (value >= 1000) {
            return `${(value / 1000).toFixed(0)}k ₽`;
        }

        return `${value} ₽`;
    };

    // Find max values for scaling
    const maxIncomeExpense = useMemo(() => {
        return Math.max(
            ...incomeExpenseData.map((d) => d.income),
            ...incomeExpenseData.map((d) => d.expenses),
        );
    }, [ incomeExpenseData ]);

    const maxCategoryAmount = useMemo(() => {
        return Math.max(...categoryData.map((d) => d.amount));
    }, [ categoryData ]);

    if (loading) {
        return (
            <div className="page gap-15 fw-w jc-c">
                <div className="action_block_1 w_g70 p-20">
                    <div className="addition_2">Загрузка аналитики...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="page gap-15 fw-w jc-c">
            {/* Income/Expense Trend Chart - Last 6 Months */}
            <div className="action_block_1 w_g70 p-0">
                <div className="title_div">
                    <span className="title">Динамика расходов и доходов</span>
                    <span className="addition_3 fg-1">Последние 6 месяцев</span>
                </div>

                <div className="simple-chart-container" style={ { padding: "20px" } }>
                    <div className="chart-y-axis">
                        <div className="y-label">{formatMoney(maxIncomeExpense)}</div>
                        <div className="y-label">{formatMoney(maxIncomeExpense * 0.75)}</div>
                        <div className="y-label">{formatMoney(maxIncomeExpense * 0.5)}</div>
                        <div className="y-label">{formatMoney(maxIncomeExpense * 0.25)}</div>
                        <div className="y-label">0 ₽</div>
                    </div>

                    <div className="chart-content">
                        <div className="chart-bars">
                            {incomeExpenseData.map((data, index) => (
                                <div key={ index } className="chart-column-group">
                                    <div className="chart-column income-column"
                                        style={ { height: `${(data.income / maxIncomeExpense) * 80}%` } }>
                                        <div className="column-value">{formatMoney(data.income)}</div>
                                    </div>
                                    <div className="chart-column expenses-column"
                                        style={ { height: `${(data.expenses / maxIncomeExpense) * 80}%` } }>
                                        <div className="column-value">{formatMoney(data.expenses)}</div>
                                    </div>
                                    <div className="month-label">{data.month}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="chart-legend">
                        <div className="legend-item">
                            <div className="legend-color income-color"></div>
                            <span className="addition_2">Доходы</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-color expenses-color"></div>
                            <span className="addition_2">Расходы</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Breakdown Chart - Current Month */}
            <div className="action_block_1 w_g30 p-0">
                <div className="title_div">
                    <span className="title">Расходы по категориям</span>
                    <span className="addition_3 fg-1">Текущий месяц</span>
                </div>

                <div className="simple-chart-container" style={ { padding: "20px" } }>
                    {categoryData.length > 0 ? (
                        <>
                            <div className="chart-horizontal">
                                {categoryData.map((item, index) => (
                                    <div key={ index } className="category-row">
                                        <span className="category-name addition_2">{item.category}</span>
                                        <div className="category-bar-container">
                                            <div
                                                className="category-bar"
                                                style={ {
                                                    width: `${(item.amount / maxCategoryAmount) * 90}%`,
                                                    backgroundColor: item.color,
                                                } }
                                            >
                                                <span className="bar-value addition_1">{formatMoney(item.amount)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="no-data">
                            <span className="addition_2">Нет данных за текущий месяц</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
