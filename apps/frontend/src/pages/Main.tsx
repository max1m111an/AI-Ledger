import React, {
    useEffect, useState,
} from "react";
import "@assets/scss/index.scss";
import LastOperations from "@/widgets/main/LastOperations.tsx";
import TodayStatistics from "@/widgets/main/TodayStatistics.tsx";
import UpcomingSubscriptions from "@/widgets/main/UpcomingSubscriptions.tsx";
import CategoriesChart from "@/widgets/main/CategoriesСhart.tsx";
import type { Paycheck } from "@interfaces/models/PaychecksModel.ts";
import { paychecksApi } from "@/api/PaychecksApi.ts";
import type { Sub } from "@interfaces/models/SubModel.ts";
import { subsApi } from "@/api/SubsApi.ts";


export default function Main() {
    const [ paychecks, setPaychecks ] = useState<Paycheck[]>([]);
    const [ subs, setSubs ] = useState<Sub[]>([]);
    useEffect(() => {
        fetchPaychecks();
        fetchSubs();

    }, [ ]);

    const fetchPaychecks = async() => {
        try {
            const res = await paychecksApi.getPaychecks();
            setPaychecks(res.paychecks);
            console.log(res);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchSubs = async() => {
        try {
            const res = await subsApi.getSubs();
            setSubs(res.subs);
            console.log(res);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="page gap-15 fw-w jc-c">
            <TodayStatistics paychecks={ paychecks } subs = { subs } className="action_block_1 w_g70" />
            <CategoriesChart className="action_block_1 w_g30" />
            <LastOperations paychecks={ paychecks } className="action_block_1 w_g70 p-0" />
            <UpcomingSubscriptions subs = { subs } className="action_block_1 w_g30" />
        </div>
    );
}
