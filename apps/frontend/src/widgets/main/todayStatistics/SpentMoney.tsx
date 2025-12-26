import React, {
    useState, useEffect,
} from "react";
import "@assets/scss/index.scss";
import type { Paycheck } from "@interfaces/models/PaychecksModel.ts";

interface SpentMoneyProps {
    values: Paycheck[];
}

export default function SpentMoney({ values }: SpentMoneyProps) {
    const [ paychecks, setPaychecks ] = useState<Paycheck[]>([]);

    useEffect(() => {
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
        setPaychecks(todayPaychecks);
    }, [ values ]);

    const spentAmount = paychecks.reduce((total, paycheck) => total + (paycheck.price || 0), 0);
    const operationsCount = paychecks.length;

    return (
        <div className="today money_block">
            <span className="addition_2">Потрачено</span>
            <span className="spent_money fs-30">-{spentAmount}</span>
            <span className="addition_3">в {operationsCount} операциях</span>
        </div>
    );
}
