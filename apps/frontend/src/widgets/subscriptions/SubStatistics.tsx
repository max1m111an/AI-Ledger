import React, {
    useState, useEffect, useMemo,
} from "react";
import "@assets/scss/index.scss";
import { subsApi } from "@/api/SubsApi.ts";
import type { Sub } from "@interfaces/models/SubModel.ts";

export const SubStatistics: React.FC = () => {
    const [ subs, setSubs ] = useState<Sub[]>([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async() => {
        try {
            const res = await subsApi.getSubs();
            setSubs(res.subs);
        } catch (err) {
            console.error("Error fetching subscriptions:", err);
        } finally {
            setLoading(false);
        }
    };

    const calculateExpenses = useMemo(() => {
        let monthlyTotal = 0;
        let yearlyTotal = 0;

        subs.forEach((sub) => {
            const price = sub.price || 0;

            if (sub.period === 1) {
                monthlyTotal += price;
                yearlyTotal += price * 12;
            } else if (sub.period === 12) {
                yearlyTotal += price;
                monthlyTotal += price / 12;
            } else if (sub.period === 3) {
                monthlyTotal += price / 3;
                yearlyTotal += price * 4;
            } else if (sub.period === 6) {
                monthlyTotal += price / 6;
                yearlyTotal += price * 2;
            }
        });

        return {
            monthly: Math.round(monthlyTotal),
            yearly: Math.round(yearlyTotal),
        };
    }, [ subs ]);

    const formatMoney = (amount: number) => {
        return `-${amount.toLocaleString("ru-RU")}`;
    };

    if (loading) {
        return (
            <div className="action_block_1 w_g30">
                <span className="title">Итоги</span>
                <span className="addition_3 mb-20">Ежемесячные и годовые расходы на подписки</span>
                <div className="action_block_2 fd-r b-r mb">
                    <div className="sub_every_div">
                        <span className="addition_2">Ежемесячно</span>
                        <span className="spent_money fs-30">-0</span>
                    </div>
                    <div className="sub_every_div">
                        <span className="addition_2">Ежегодно</span>
                        <span className="spent_money fs-30">-0</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="action_block_1 w_g30">
            <span className="title">Итоги</span>
            <span className="addition_3 mb-20">Ежемесячные и годовые расходы на подписки</span>
            <div className="action_block_2 fd-r b-r mb">
                <div className="sub_every_div">
                    <span className="addition_2">Ежемесячно</span>
                    <span className="spent_money fs-30">{formatMoney(calculateExpenses.monthly)}</span>
                </div>
                <div className="sub_every_div">
                    <span className="addition_2">Ежегодно</span>
                    <span className="spent_money fs-30">{formatMoney(calculateExpenses.yearly)}</span>
                </div>
            </div>
            <div className="action_block_2 fg-1">
            </div>
        </div>
    );
};
