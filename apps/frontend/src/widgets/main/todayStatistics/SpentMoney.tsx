import React from "react";
import "@assets/scss/index.scss";


export default function SpentMoney() {
    return (
        <div className="today money_block">
            <p className="text addition_1 subtext">Потрачено</p>
            <p className="text addition_1 spent_money">-378</p>
            <p className="text addition_2 subtext">в 2 операциях</p>
        </div>
    );
}
