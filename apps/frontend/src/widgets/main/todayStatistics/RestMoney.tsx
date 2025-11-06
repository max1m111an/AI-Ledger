import React from "react";
import "@assets/scss/index.scss";
import ProgressBar from "@components/ProgressBar.tsx";


export default function RestMoney() {
    return (
        <div className="today money_block">
            <span className="addition_2">Остаток по дневному лимиту</span>
            <span className="rest_money fs-30 mb-5">+3622</span>
            <ProgressBar current={ 3622 } max={ 15000 } />
        </div>
    );
}
