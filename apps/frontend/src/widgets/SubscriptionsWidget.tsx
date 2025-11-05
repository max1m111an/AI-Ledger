import React from "react";
import "@assets/scss/index.scss";
import { SubList } from "@/widgets/subscriptions/SubList.tsx";
import { SubStatistics } from "@/widgets/subscriptions/SubStatistics.tsx";

export const SubscriptionsWidget: React.FC = () => {
    return (
        <div className="page fd-c">
            <span className="title">Подписки</span>
            <span className="addition_3 mb-7">Активные подписки и ближайшие списания</span>
            <div className="sub_div">
                <SubList />
                <SubStatistics />
            </div>
        </div>
    );
};
