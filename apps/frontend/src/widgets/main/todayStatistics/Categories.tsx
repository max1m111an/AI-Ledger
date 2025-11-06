import React from "react";
import "@assets/scss/index.scss";


export default function Categories() {
    return (
        <div className="today money_block">
            <span className="addition_2">Категории сегодня</span>
            <div className="today categories_div">
                <span className="label yellow">Транспорт</span>
                <span className="label red">Кафе</span>
                <span className="label green">Донат</span>
                <span className="label blue">Еда</span>
            </div>
        </div>
    );
}
