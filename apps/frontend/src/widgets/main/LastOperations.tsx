import React from "react";
import "@assets/scss/index.scss";
import { NavLink } from "react-router-dom";
import { ROUTES } from "@/configs/RoutesConst.ts";
import type { Paycheck } from "@interfaces/models/PaychecksModel.ts";

interface LastOperationsProps {
    className?: string;
    paychecks: Paycheck[];
}

export default function LastOperations({
    className, paychecks,
}: LastOperationsProps) {
    const today = new Date();
    const todayStart = Math.floor(new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime() / 1000);

    const pastPaychecks = paychecks.filter((paycheck) => {
        if (!paycheck.pay_date) {
            return false;
        }

        return paycheck.pay_date < todayStart + 86400;
    });

    const sortedPaychecks = [ ...pastPaychecks ]
        .sort((a, b) => {
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
        })
        .slice(0, 5);

    const formatDate = (timestamp: number | null) => {
        if (!timestamp) {
            return "Дата не указана";
        }

        const date = new Date(timestamp * 1000);
        const dateStart = Math.floor(new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / 1000);

        const diffDays = Math.floor((todayStart - dateStart) / 86400);

        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");

        if (diffDays === 0) {
            return `сегодня, ${hours}:${minutes}`;
        }

        if (diffDays === 1) {
            return `вчера, ${hours}:${minutes}`;
        }

        if (diffDays === 2) {
            return "2 дня назад";
        }

        if (diffDays === 3) {
            return "3 дня назад";
        }

        if (diffDays <= 7) {
            return `${diffDays} дней назад`;
        }

        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear() !== today.getFullYear() ? `.${date.getFullYear()}` : "";

        return `${day}.${month}${year}`;
    };

    const getIconForCategory = (category: string) => {
        const iconMap: Record<string, string> = {
            "Cafe": "#Cafe",
            "Transport": "#Transport",
            "Transfer": "#Finance",
            "Utilities": "#Utilities",
            "Healthcare": "#Healthcare",
            "Marketplace": "#Shop",
            "Entertainment": "#Entertainment",
            "Shop": "#Shop",
            "Other": "#Other",
        };

        return iconMap[category] || "#Subscription";
    };

    const getIconColor = (category: string) => {
        const colors: Record<string, string> = {
            "Cafe": "sweet_corn",
            "Transport": "blue",
            "Transfer": "riptide",
            "Utilities": "malibu",
            "Healthcare": "magic_mint",
            "Marketplace": "melrose",
            "Entertainment": "golden",
            "Shop": "periwinkle",
            "Other": "pastel_pink",
        };

        return colors[category] || "blue";
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

    const getPriceDisplay = (price: number | null | undefined, category: string | null | undefined): string => {
        const priceValue = price || 0;

        if (category === "Transfer") {
            return `+${Math.abs(priceValue)}`;
        } else {
            return `-${Math.abs(priceValue)}`;
        }
    };

    return (
        <div className={ className }>
            <div className="lastOperations title_div">
                <span className="title">Последние операции</span>
                <span className="addition_3 fg-1">{sortedPaychecks.length} последних</span>
                <NavLink to={ ROUTES.OPERATION } className="links">Все операции</NavLink>
            </div>
            <div className="lastOperations operations_list">
                {sortedPaychecks.map((paycheck) => {
                    const iconName = getIconForCategory(paycheck.category);
                    const colorClass = getIconColor(paycheck.category);

                    return (
                        <div key={ paycheck.id } className="lastOperations listOperation_div">
                            <svg className={ `categoriaIcon ${colorClass}` }>
                                <use href={ iconName } />
                            </svg>
                            <div className="today subscription_info_div">
                                <span className="addition_1">{paycheck.name}</span>
                                <span className="addition_3">
                                    {categoryNames[paycheck.category] || paycheck.category} • {formatDate(paycheck.pay_date)}
                                </span>
                            </div>
                            <p className={ `addition_1 ${paycheck.category === "Transfer" ? "rest_money" : "spent_money"}` }>
                                {getPriceDisplay(paycheck.price, paycheck.category)}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
