import React from "react";
import "@assets/scss/index.scss";
import { NavLink } from "react-router-dom";
import { ROUTES } from "@/configs/RoutesConst.ts";
import type { Sub } from "@interfaces/models/SubModel.ts";

export default function Subscription({ subs }: { subs: Sub[] }) {
    const getPeriodText = (period: number): string => {
        if (period === 1) {
            return "Ежемесячно";
        }

        if (period === 12) {
            return "Ежегодно";
        }

        return `Каждые ${period} месяца`;
    };

    if (!subs || !Array.isArray(subs)) {
        return (
            <div className="today subscription_div_1">
                <div className="today title_div">
                    <p className="title fw-500 fs-18">
                        <svg className="icon">
                            <use href="#Reminder" />
                        </svg>
                        Сегодняшние напоминания
                    </p>
                    <NavLink to={ ROUTES.SUBSCRIPTIONS } className="links fs-14">К подпискам</NavLink>
                </div>
                <div className="today subscription_div_2">
                    <span className="addition_3">Нет подписок</span>
                </div>
            </div>
        );
    }

    return (
        <div className="today subscription_div_1">
            <div className="today title_div">
                <p className="title fw-500 fs-18">
                    <svg className="icon">
                        <use href="#Reminder" />
                    </svg>
                    Сегодняшние напоминания
                </p>
                <NavLink to={ ROUTES.SUBSCRIPTIONS } className="links fs-14">К подпискам</NavLink>
            </div>
            <div className="today subscription_div_2">
                {subs.map((sub, index) => (
                    <div key={ index } className="today subscription_div_3">
                        <svg className="icon magic_mint">
                            <use href="#Subscriptions" />
                        </svg>
                        <div className="today subscription_info_div">
                            <span className="addition_1">{sub.name}</span>
                            <span className="addition_3">{getPeriodText(sub.period)}</span>
                        </div>
                        <p className="addition_1">- {sub.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
