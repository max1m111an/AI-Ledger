import React from "react";
import "@assets/scss/index.scss";
import { getToday } from "@utils/Date.ts";
import SpentMoney from "@/widgets/main/todayStatistics/SpentMoney.tsx";
import RestMoney from "@/widgets/main/todayStatistics/RestMoney.tsx";
import Categories from "@/widgets/main/todayStatistics/Categories.tsx";
import Subscription from "@/widgets/main/todayStatistics/Subscription.tsx";
import type { Paycheck } from "@interfaces/models/PaychecksModel.ts";
import type { Sub } from "@interfaces/models/SubModel.ts";

interface TodayStatisticsProps {
    className?: string;
    paychecks: Paycheck[];
    subs: Sub[];
}

export default function TodayStatistics({
    className, paychecks, subs,
}: TodayStatisticsProps) {
    return (
        <div className={ className }>
            <div className="today title_div">
                <span className="title">Сегодня</span>
                <span className="addition_2">
                    <svg className="icon">
                        <use href="#Data" />
                    </svg>
                    {getToday()}
                </span>
            </div>
            <div className="today money_info_div">
                <SpentMoney values={ paychecks } />
                <RestMoney values={ paychecks } />
                <Categories values={ paychecks } />
            </div>
            <Subscription subs={ subs } />
        </div>
    );
}
