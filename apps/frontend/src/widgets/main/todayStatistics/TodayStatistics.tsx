import React from "react";
import "@assets/scss/index.scss";
import { getToday } from "@utils/Date.ts";
import SpentMoney from "@/widgets/main/todayStatistics/SpentMoney.tsx";
import RestMoney from "@/widgets/main/todayStatistics/RestMoney.tsx";
import Categories from "@/widgets/main/todayStatistics/Categories.tsx";
import Subscription from "@/widgets/main/todayStatistics/Subscription.tsx";

interface TodayStatisticsProps {
    className?: string;
}

export default function TodayStatistics({ className }: TodayStatisticsProps) {
    return (
        <div className={ className }>
            <div className="today title_div">
                <p className="text title">Сегодня</p>
                <p className="text addition_1">{getToday()}</p>
            </div>
            <div className="today money_info">
                <SpentMoney />
                <RestMoney />
                <Categories />
            </div>
            <Subscription />
        </div>
    );
}
