import React from "react";
import "@assets/scss/index.scss";
import { NavLink } from "react-router-dom";
import { ROUTES } from "@/configs/RoutesConst.ts";


interface LastWritedownsProps {
    className?: string;
}

export default function UpcomingSubscriptions({ className }: LastWritedownsProps) {
    const writeDowns = [
        {
            name: "Youtube Premium",
            date: "через 2 дня",
            value: -320,
        },
        {
            name: "Adobe",
            date: "через 5 дней",
            value: -320,
        }, {
            name: "Донаты Паше <3",
            date: "forever",
            value: -666,
        },

    ];

    return (
        <div className={ className }>
            <div className="upcomingSubscriptions title_div">
                <p className="text title">Списания</p>
                <p className="text subaddition">(7 дней)</p>
                <NavLink to={ ROUTES.SUBSCRIPTIONS } className="text links">Все</NavLink>
            </div>
            <div className="upcomingSubscriptions upcomingSubscription_list">
                {writeDowns.map((writeDown, index) => (
                    <div key={ index } className="upcomingSubscriptions upcomingSubscription_div">
                        <svg className="icon magic_mint">
                            <use href="#Subscriptions" />
                        </svg>
                        <div className="today subscription_info_div">
                            <span className="text">{writeDown.name}</span>
                            <span className="text addition_2">{writeDown.date}</span>
                        </div>
                        <p className="text">{writeDown.value}</p>
                    </div>
                ))}
                <button className="Button uploadReceipt">Загрузить чек</button>
            </div>
        </div>
    );
}
