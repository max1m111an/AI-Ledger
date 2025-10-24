import React from "react";
import "@assets/scss/index.scss";
import ProgressBar from "@components/ProgressBar.tsx";


export default function RestMoney() {
    return (
        <div className="today money_block">
            <p className="text addition_1 subtext">Остаток по дневному лимиту</p>
            <p className="text addition_1 rest_money">+3622</p>
            <ProgressBar current={ 3622 } max={ 15000 } />
        </div>
    );
}
