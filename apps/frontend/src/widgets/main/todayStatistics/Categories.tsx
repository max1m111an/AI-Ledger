import React from "react";
import "@assets/scss/index.scss";


export default function Categories() {
    return (
        <div className="today money_block">
            <p className="text addition_1 subtext">Категории сегодня</p>
            <div className="today categories_div">
                <p className="label yellow">Транспорт</p>
                <p className="label red">Кафе</p>
                <p className="label green">Донат</p>
                <p className="label blue">Еда</p>
            </div>
        </div>
    );
}
