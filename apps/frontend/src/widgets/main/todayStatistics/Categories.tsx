import React from "react";
import "@assets/scss/index.scss";
import type { Paycheck } from "@interfaces/models/PaychecksModel.ts";

interface CategoriesProps {
    values: Paycheck[];
}

export default function Categories({ values }: CategoriesProps) {
    const today = new Date();
    const todayStart = Math.floor(new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime() / 1000);
    const todayEnd = todayStart + 86400;

    const todayPaychecks = values.filter((paycheck) => {
        if (!paycheck.pay_date) {
            return false;
        }

        if (paycheck.category === "Transfer") {
            return false;
        }

        return paycheck.pay_date >= todayStart && paycheck.pay_date < todayEnd;
    });

    const uniqueCategories = Array.from(
        new Set(
            todayPaychecks
                .map((paycheck) => paycheck.category || "Other")
                .filter((category) => category !== "Transfer"),
        ),
    );

    const categoryColors: Record<string, string> = {
        "Cafe": "yellow",
        "Transport": "orange",
        "Utilities": "blue",
        "Healthcare": "green",
        "Marketplace": "periwinkle",
        "Entertainment": "mustard",
        "Shop": "melrose",
        "Other": "blue",
    };

    const categoryNames: Record<string, string> = {
        "Cafe": "Кафе",
        "Transport": "Транспорт",
        "Utilities": "Коммуналка",
        "Healthcare": "Здоровье",
        "Marketplace": "Маркетплейс",
        "Entertainment": "Развлечения",
        "Shop": "Магазин",
        "Other": "Другое",
    };

    if (uniqueCategories.length === 0) {
        return (
            <div className="today money_block">
                <span className="addition_2">Категории сегодня</span>
                <div className="today categories_div">
                    <span className="addition_3">Нет операций за сегодня</span>
                </div>
            </div>
        );
    }

    return (
        <div className="today money_block">
            <span className="addition_2">Категории сегодня</span>
            <div className="today categories_div">
                {uniqueCategories.map((category) => {
                    const colorClass = categoryColors[category] || "blue";
                    const displayName = categoryNames[category] || category;

                    return (
                        <span
                            key={ category }
                            className={ `label ${colorClass}` }
                            title={ displayName }
                        >
                            {displayName}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}
