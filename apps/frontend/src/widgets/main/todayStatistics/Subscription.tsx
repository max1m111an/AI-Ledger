import React from "react";
import "@assets/scss/index.scss";
import {
    NavLink,
} from "react-router-dom";
import { ROUTES } from "@/configs/RoutesConst.ts";


export default function Subscription() {
    const subscriptions = [
        {
            name: "Яндекс музыка",
            period: "Ежемесячно",
        },
        {
            name: "Spotify",
            period: "Ежемесячно",
        },
        {
            name: "Youtube",
            period: "Ежемесячно",
        },
    ];

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
                {subscriptions.map((subscription, index) => (
                    <div key={ index } className="today subscription_div_3">
                        <svg className="icon magic_mint">
                            <use href="#Subscriptions" />
                        </svg>
                        <div className="today subscription_info_div">
                            <span className="addition_1">{subscription.name}</span>
                            <span className="addition_3">{subscription.period}</span>
                        </div>
                        <p className="addition_1">- 299</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
