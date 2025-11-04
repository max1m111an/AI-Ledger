import React, {
    useEffect, useState, useMemo,
} from "react";
import { paychecksApi } from "@/api/PaychecksApi.ts";
import type { Paycheck } from "@interfaces/models/PaychecksModel.ts";

type TimeFilter = "all" | "day" | "week" | "month" | "year" | "period";
type TypeFilter = "all" | "expense" | "income";

export default function OperationsWidget() {
    const [ paychecks, setPaychecks ] = useState<Paycheck[]>([]);
    const [ timeFilter, setTimeFilter ] = useState<TimeFilter>("all");
    const [ typeFilter, setTypeFilter ] = useState<TypeFilter>("all");
    const [ categoryFilter, setCategoryFilter ] = useState<string>("all");
    const [ searchQuery, setSearchQuery ] = useState("");
    const [ startDate, setStartDate ] = useState<string>("");
    const [ endDate, setEndDate ] = useState<string>("");
    const [ selectedIds, setSelectedIds ] = useState<number[]>([]);
    const [ isDeleting, setIsDeleting ] = useState(false);

    useEffect(() => {
        fetchPaychecks();
    }, []);

    const fetchPaychecks = async() => {
        try {
            const res = await paychecksApi.getPaychecks();
            setPaychecks(res.paychecks);
            setSelectedIds([]);
        } catch (err) {
            console.error(err);
        }
    };

    const formatDate = (timestamp: number | null | undefined): string => {
        if (!timestamp) {
            return "";
        }
        const date = new Date(timestamp * 1000);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");

        return `${day}.${month} ${hours}:${minutes}`;
    };

    const handleSelectPaycheck = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleSelectAll = () => {
        if (selectedIds.length === filteredPaychecks.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredPaychecks.map(p => p.id).filter(id => id !== undefined));
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) return;

        const confirmed = window.confirm(`Вы уверены, что хотите удалить ${selectedIds.length} операций?`);
        if (!confirmed) return;

        setIsDeleting(true);
        try {
            await paychecksApi.deletePaychecks({ id: selectedIds });
            await fetchPaychecks();
        } catch (error) {
            console.error("Ошибка при удалении операций:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredPaychecks = useMemo(() => {
        let filtered = [ ...paychecks ];

        const now = new Date();

        if (timeFilter === "day") {
            const startOfDay = Math.floor(new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000);
            const endOfDay = startOfDay + 86400;
            filtered = filtered.filter((p) => p.pay_date && p.pay_date >= startOfDay && p.pay_date < endOfDay);
        } else if (timeFilter === "week") {
            const dayOfWeek = now.getDay();
            const startOfWeek = Math.floor(
                new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek).getTime() / 1000,
            );
            const endOfWeek = startOfWeek + 7 * 86400;
            filtered = filtered.filter((p) => p.pay_date && p.pay_date >= startOfWeek && p.pay_date < endOfWeek);
        } else if (timeFilter === "month") {
            const startOfMonth = Math.floor(
                new Date(now.getFullYear(), now.getMonth(), 1).getTime() / 1000,
            );
            const endOfMonth = Math.floor(
                new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime() / 1000,
            );
            filtered = filtered.filter((p) => p.pay_date && p.pay_date >= startOfMonth && p.pay_date < endOfMonth);
        } else if (timeFilter === "year") {
            const startOfYear = Math.floor(
                new Date(now.getFullYear(), 0, 1).getTime() / 1000,
            );
            const endOfYear = Math.floor(
                new Date(now.getFullYear() + 1, 0, 1).getTime() / 1000,
            );
            filtered = filtered.filter((p) => p.pay_date && p.pay_date >= startOfYear && p.pay_date < endOfYear);
        } else if (timeFilter === "period" && startDate && endDate) {
            const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
            const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000) + 86400;
            filtered = filtered.filter((p) => p.pay_date && p.pay_date >= startTimestamp && p.pay_date < endTimestamp);
        }

        if (categoryFilter !== "all") {
            filtered = filtered.filter((p) => p.category === categoryFilter);
        }

        if (typeFilter === "expense") {
            filtered = filtered.filter((p) => p.category !== "Transfer");
        } else if (typeFilter === "income") {
            filtered = filtered.filter((p) => p.category === "Transfer");
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((p) =>
                (p.name?.toLowerCase().includes(query) ||
                    p.category?.toLowerCase().includes(query)),
            );
        }

        return filtered.sort((a, b) => {
            if (!a.pay_date && !b.pay_date) {
                return 0;
            }

            if (!a.pay_date) {
                return 1;
            }

            if (!b.pay_date) {
                return -1;
            }

            return b.pay_date - a.pay_date;
        });
    }, [ paychecks, timeFilter, categoryFilter, typeFilter, searchQuery, startDate, endDate ]);

    const handleApplyPeriod = () => {
        if (startDate && endDate) {
            setTimeFilter("period");
        }
    };

    const handleResetFilters = () => {
        setTimeFilter("all");
        setTypeFilter("all");
        setCategoryFilter("all");
        setSearchQuery("");
        setStartDate("");
        setEndDate("");
        setSelectedIds([]);
    };

    const getCategoryName = (category: string | null | undefined): string => {
        if (!category) {
            return "";
        }

        switch (category) {
            case "Cafe": return "Кафе";
            case "Transfer": return "Зарплата";
            case "Transport": return "Транспорт";
            case "Utilities": return "Коммунальные";
            case "Healthcare": return "Здоровье";
            case "Marketplace": return "Маркетплейсы";
            case "Entertainment": return "Развлечения";
            case "Shop": return "Магазины";
            case "Other": return "Другое";
            default: return category;
        }
    };

    const getPriceDisplay = (price: number | null | undefined, category: string | null | undefined): string => {
        const priceValue = price || 0;

        if (category === "Transfer") {
            return `+${Math.abs(priceValue)} ₽`;
        } else {
            return `-${Math.abs(priceValue)} ₽`;
        }
    };

    const getPriceClass = (category: string | null | undefined): string => {
        if (category === "Transfer") {
            return "positive";
        } else {
            return "negative";
        }
    };

    const categories = [
        {
            value: "Cafe",
            label: "Кафе",
        },
        {
            value: "Transfer",
            label: "Transfer",
        },
        {
            value: "Transport",
            label: "Транспорт",
        },
        {
            value: "Utilities",
            label: "Коммунальные",
        },
        {
            value: "Healthcare",
            label: "Здоровье",
        },
        {
            value: "Marketplace",
            label: "Маркетплейсы",
        },
        {
            value: "Entertainment",
            label: "Развлечения",
        },
        {
            value: "Shop",
            label: "Магазины",
        },
        {
            value: "Other",
            label: "Другое",
        },
    ];

    return (
        <div className="page fd-c">
            <div className="oper_head_div">
                <div className="oper_title_div">
                    <span className="title">Операции</span>
                    <span className="addition_3">Сортировка, фильтры, и поиск по всем транзакциям</span>
                </div>
                <div className="oper_button_div">
                    <input
                        className="input"
                        placeholder="Поиск по описанию / категории"
                        value={ searchQuery }
                        onChange={ (e) => setSearchQuery(e.target.value) }
                    />
                    {selectedIds.length > 0 && (
                        <button
                            className="Button oper delete"
                            onClick={handleDeleteSelected}
                            disabled={isDeleting}
                            style={{
                                backgroundColor: "#dc3545",
                                marginLeft: "10px"
                            }}
                        >
                            {isDeleting ? "Удаление..." : `Удалить выбранные (${selectedIds.length})`}
                        </button>
                    )}
                    <button
                        className="Button oper"
                        onClick={ handleResetFilters }
                        style={{ marginLeft: "10px" }}
                    >
                        Сбросить фильтры
                    </button>
                </div>
            </div>
            <div className="action_block_1 fd-r g-10 mb-15">
                <div className="line_div">
                    <button
                        className={ `line ${timeFilter === "all" ? "active" : ""}` }
                        onClick={ () => setTimeFilter("all") }
                    >
                        Все
                    </button>
                    <button
                        className={ `line ${timeFilter === "day" ? "active" : ""}` }
                        onClick={ () => setTimeFilter("day") }
                    >
                        День
                    </button>
                    <button
                        className={ `line ${timeFilter === "week" ? "active" : ""}` }
                        onClick={ () => setTimeFilter("week") }
                    >
                        Неделя
                    </button>
                    <button
                        className={ `line ${timeFilter === "month" ? "active" : ""}` }
                        onClick={ () => setTimeFilter("month") }
                    >
                        Месяц
                    </button>
                    <button
                        className={ `line ${timeFilter === "year" ? "active" : ""}` }
                        onClick={ () => setTimeFilter("year") }
                    >
                        Год
                    </button>
                    <div className="period-selector fd-r g-5">
                        <input
                            type="date"
                            className="input small"
                            value={ startDate }
                            onChange={ (e) => setStartDate(e.target.value) }
                            placeholder="Начало"
                        />
                        <input
                            type="date"
                            className="input small"
                            value={ endDate }
                            onChange={ (e) => setEndDate(e.target.value) }
                            placeholder="Конец"
                        />
                        <button
                            className="Button small"
                            onClick={ handleApplyPeriod }
                            disabled={ !startDate || !endDate }
                        >
                            Применить
                        </button>
                    </div>
                </div>
                <div className="line_div">
                    <button
                        className={ `line ${typeFilter === "all" ? "active" : ""}` }
                        onClick={ () => setTypeFilter("all") }
                    >
                        Все
                    </button>
                    <button
                        className={ `line ${typeFilter === "expense" ? "active" : ""}` }
                        onClick={ () => setTypeFilter("expense") }
                    >
                        Расход
                    </button>
                    <button
                        className={ `line ${typeFilter === "income" ? "active" : ""}` }
                        onClick={ () => setTypeFilter("income") }
                    >
                        Доход
                    </button>
                </div>
                <select
                    className="input"
                    value={ categoryFilter }
                    onChange={ (e) => setCategoryFilter(e.target.value) }
                >
                    <option value="all">Все категории</option>
                    {categories.map((cat) => (
                        <option key={ cat.value } value={ cat.value }>
                            {cat.label}
                        </option>
                    ))}
                </select>
                <button
                    className="Button oper"
                    onClick={ handleResetFilters }
                >
                    Сбросить все
                </button>
            </div>
            <div className="table_action_div w-100">
                <div className="table_scroll_wrapper">
                    <table className="sub_table">
                        <thead>
                        <tr>
                            <th className="cell_title" style={{ width: "40px" }}>
                                <input
                                    type="checkbox"
                                    checked={filteredPaychecks.length > 0 && selectedIds.length === filteredPaychecks.length}
                                    onChange={handleSelectAll}
                                    disabled={filteredPaychecks.length === 0}
                                />
                            </th>
                            <th className="cell_title">Описание</th>
                            <th className="cell_title">Категории</th>
                            <th className="cell_title">Дата</th>
                            <th className="cell_title">Сумма</th>
                            <th className="cell_title" style={{ width: "100px" }}>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredPaychecks.map((paycheck) => (
                            <tr key={ paycheck.id }>
                                <td className="cell_value">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(paycheck.id)}
                                        onChange={() => handleSelectPaycheck(paycheck.id)}
                                    />
                                </td>
                                <td className="cell_value">{paycheck.name || "-"}</td>
                                <td className="cell_value">
                                    {getCategoryName(paycheck.category)}
                                </td>
                                <td className="cell_value">{formatDate(paycheck.pay_date)}</td>
                                <td className={ `cell_value ${getPriceClass(paycheck.category)}` }>
                                    {getPriceDisplay(paycheck.price, paycheck.category)}
                                </td>
                                <td className="cell_value">
                                    <button
                                        className="Button small delete"
                                        onClick={async () => {
                                            const confirmed = window.confirm("Вы уверены, что хотите удалить эту операцию?");
                                            if (!confirmed) return;

                                            try {
                                                await paychecksApi.deletePaychecks({ id: [paycheck.id] });
                                                await fetchPaychecks();
                                            } catch (error) {
                                                console.error("Ошибка при удалении операции:", error);
                                            }
                                        }}
                                        style={{
                                            padding: "5px 10px",
                                            fontSize: "12px",
                                            backgroundColor: "#dc3545",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Удалить
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                {filteredPaychecks.length === 0 && (
                    <div className="empty-state">
                        <span>Нет операций по выбранным фильтрам</span>
                    </div>
                )}
            </div>
        </div>
    );
}
