import React from "react";
import "@assets/scss/index.scss";
import LastOperations from "@/widgets/main/LastOperations.tsx";
import TodayStatistics from "@/widgets/main/TodayStatistics.tsx";
import UpcomingSubscriptions from "@/widgets/main/UpcomingSubscriptions.tsx";
import CategoriesChart from "@/widgets/main/CategoriesСhart.tsx";


export default function Main() {
    return (
        <div className="main_div">
            <TodayStatistics className="action_div big" />
            <CategoriesChart className="action_div small" />
            <LastOperations className="action_div big lastOperations" />
            <UpcomingSubscriptions className="action_div small" />
        </div>
    );
}
