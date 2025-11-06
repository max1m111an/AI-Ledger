import React from "react";
import "@assets/scss/index.scss";


export default function SpentMoney() {
    return (
        <div className="today money_block">
            <span className="addition_2">Потрачено</span>
            <span className="spent_money fs-30">-378</span>
            <span className="addition_3">в 2 операциях</span>
        </div>
    );
}
