import React from "react";
import "@assets/scss/index.scss";
import { NavLink } from "react-router-dom";
import { ROUTES } from "@/configs/RoutesConst.ts";


interface LastOperationsProps {
    className?: string;
}
export default function LastOperations({ className }: LastOperationsProps) {
    const operations = [
        {
            categoria: "Кофейня 'Beans'",
            subcategoria: "Кафе",
            date: "сегодня, 09:24",
            value: -320,
        },
        {
            categoria: "Метро",
            subcategoria: "Транспорт",
            date: "сегодня, 09:24",
            value: -58,
        },
        {
            categoria: "Пятерочка",
            subcategoria: "Еда, Гигиена",
            date: "вчера, 19:43",
            value: -1240,
        },
        {
            categoria: "Зарплата",
            subcategoria: "Доход",
            date: "2 дня назад",
            value: +120000,
        },
        {
            categoria: "Netflix",
            subcategoria: "Подписки",
            date: "3 дня назад",
            value: -999,
        },
    ];

    return (
        <div className={ className }>
            <div className="lastOperations title_div">
                <p className="text title">Последние операции</p>
                <p className="text subaddition">5 последних</p>
                <NavLink to={ ROUTES.SUBSCRIPTIONS } className="text links">Все операции</NavLink>
            </div>
            <div className="lastOperations operations_list">
                {operations.map((operation, index) => (
                    <div key={ index } className="lastOperations listOperation_div">
                        <svg className="categoriaIcon">
                            <use href="#Subscription" />
                        </svg>
                        <div className="today subscription_info_div">
                            <span className="text">{operation.categoria}</span>
                            <span className="text addition_2">{operation.subcategoria} • {operation.date}</span>
                        </div>
                        <p className="text">{operation.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
