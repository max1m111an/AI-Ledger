import React, {
    useEffect, useState,
} from "react";
import "@assets/scss/index.scss";
import ProgressBar from "@components/ProgressBar.tsx";
import type { Paycheck } from "@interfaces/models/PaychecksModel.ts";
import { userApi } from "@/api/UsersApi.ts";

interface RestMoneyProps {
    values: Paycheck[];
}

export default function RestMoney({ values }: RestMoneyProps) {
    const [ daily, setDaily ] = useState<number>(0);
    useEffect(() => {
        fetchUser();
    }, [ ]);

    const fetchUser = async() => {
        try {
            const res = await userApi.getUser();
            setDaily(res.user.daily_limit);
        } catch (err) {
            console.error(err);
        }
    };

    const today = new Date();
    const todayStart = Math.floor(new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime() / 1000);
    const todayEnd = todayStart + 86400;

    const todayPaychecks = values.filter((paycheck) => {
        if (!paycheck.pay_date) {
            return false;
        }

        if (paycheck.category === "Transfer") {
            return false;
        }

        return paycheck.pay_date >= todayStart && paycheck.pay_date < todayEnd;
    });

    const spentAmount = todayPaychecks.reduce((total, paycheck) => total + (paycheck.price || 0), 0);

    const remainingAmount = (daily || 0) - spentAmount;

    const progressValue = Math.min(spentAmount, daily || 0);

    return (
        <div className="today money_block">
            <span className="addition_2">Остаток по дневному лимиту</span>
            <span className="rest_money fs-30 mb-5">
                {remainingAmount > 0 ? `+${remainingAmount}` : "0"}
            </span>
            <ProgressBar
                current={ progressValue }
                max={ daily || 1 }
            />
        </div>
    );
}
