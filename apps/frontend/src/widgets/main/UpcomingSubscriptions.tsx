import React from "react";
import "@assets/scss/index.scss";
import { NavLink } from "react-router-dom";
import { ROUTES } from "@/configs/RoutesConst.ts";
import type { Sub } from "@interfaces/models/SubModel.ts";

interface LastWritedownsProps {
    className?: string;
    subs: Sub[];
}

export default function UpcomingSubscriptions({
    className, subs,
}: LastWritedownsProps) {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime() / 1000;

    const getUpcomingSubscriptions = () => {
        const upcomingSubs: Array<{
            name: string;
            dateText: string;
            value: number;
            daysUntil: number;
            timestamp: number;
        }> = [];

        subs.forEach((sub) => {
            const paydayTimestamp = sub.payday;

            const payDate = new Date(paydayTimestamp * 1000);
            const payDateStart = new Date(payDate.getFullYear(), payDate.getMonth(), payDate.getDate()).getTime() / 1000;

            const diffSeconds = payDateStart - todayStart;
            const diffDays = Math.ceil(diffSeconds / 86400);

            if (diffDays >= 0 && diffDays <= 7) {
                let dateText = "";

                if (diffDays === 0) {
                    dateText = "сегодня";
                } else if (diffDays === 1) {
                    dateText = "завтра";
                } else if (diffDays === 2) {
                    dateText = "послезавтра";
                } else {
                    dateText = `через ${diffDays} ${getDaysText(diffDays)}`;
                }

                upcomingSubs.push({
                    name: sub.name,
                    dateText: dateText,
                    value: -sub.price,
                    daysUntil: diffDays,
                    timestamp: paydayTimestamp,
                });
            }
        });

        // Сортируем по дням до списания, а затем по времени
        return upcomingSubs.sort((a, b) => {
            if (a.daysUntil !== b.daysUntil) {
                return a.daysUntil - b.daysUntil;
            }

            return a.timestamp - b.timestamp;
        });
    };

    const getDaysText = (days: number): string => {
        if (days % 10 === 1 && days % 100 !== 11) {
            return "день";
        } else if (days % 10 >= 2 && days % 10 <= 4 && (days % 100 < 10 || days % 100 >= 20)) {
            return "дня";
        } else {
            return "дней";
        }
    };

    const upcomingSubscriptions = getUpcomingSubscriptions();

    return (
        <div className={ className }>
            <div className="upcomingSubscriptions title_div">
                <span className="title">Списания</span>
                <span className="addition_3 fg-1">(7 дней)</span>
                <NavLink to={ ROUTES.SUBSCRIPTIONS } className="links">Все</NavLink>
            </div>
            <div className="upcomingSubscriptions upcomingSubscription_list scrollable-list">
                {upcomingSubscriptions.length > 0 ? (
                    upcomingSubscriptions.map((sub, index) => (
                        <div key={ index } className="upcomingSubscriptions upcomingSubscription_div">
                            <svg className="icon magic_mint">
                                <use href="#Subscriptions" />
                            </svg>
                            <div className="today subscription_info_div">
                                <span className="addition_1">{sub.name}</span>
                                <span className="addition_3">{sub.dateText}</span>
                            </div>
                            <p className="addition_1 negative">{sub.value}</p>
                        </div>
                    ))
                ) : (
                    <div className="no-subscriptions">
                        <span className="addition_3">В ближайшие 7 дней списаний нет</span>
                    </div>
                )}
                <button className="Button uploadReceipt">Загрузить чек</button>
            </div>
        </div>
    );
}
