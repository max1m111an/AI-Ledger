import React from "react";
import "@assets/scss/index.scss";
import LastOperations from "@/widgets/main/LastOperations.tsx";
import TodayStatistics from "@/widgets/main/TodayStatistics.tsx";
import UpcomingSubscriptions from "@/widgets/main/UpcomingSubscriptions.tsx";
import CategoriesChart from "@/widgets/main/CategoriesСhart.tsx";


export default function Main() {
    return (
        <div className="page gap-15 fw-w jc-c">
            <TodayStatistics className="action_block_1 w_g70" />
            <CategoriesChart className="action_block_1 w_g30" />
            <LastOperations className="action_block_1 w_g70 p-0" />
            <UpcomingSubscriptions className="action_block_1 w_g30" />
        </div>
    );
}
