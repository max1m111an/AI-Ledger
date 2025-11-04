import React from "react";
import "@assets/scss/index.scss";
import { NavLink } from "react-router-dom";
import { ROUTES } from "@/configs/RoutesConst.ts";

export const Sidebar: React.FC = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar_logo_div">
                <div className="addition_1 u-pl-15">AI-Ledger</div>
                <div className="addition_2 u-pl-15 fs-12">Финансовый трекер</div>
            </div>
            <nav className="sidebar_nav_div">
                <NavLink to={ ROUTES.MAIN } className="Button nav">
                    <svg className="icon">
                        <use href="#Main" />
                    </svg>
                    Главная
                </NavLink>
                <NavLink to={ ROUTES.OPERATION } className="Button nav">
                    <svg className="icon">
                        <use href="#Operations" />
                    </svg>
                    Операции
                </NavLink>
                <NavLink to={ ROUTES.UPLOADING_RECEIPTS } className="Button nav">
                    <svg className="icon">
                        <use href="#UploadingReceipts" />
                    </svg>
                    Загрузка чеков
                </NavLink>
                <NavLink to={ ROUTES.SUBSCRIPTIONS } className="Button nav">
                    <svg className="icon">
                        <use href="#Subscriptions" />
                    </svg>
                    Подписки
                </NavLink>
                <NavLink to={ ROUTES.ANALYTICS } className="Button nav">
                    <svg className="icon">
                        <use href="#Analytics" />
                    </svg>
                    Аналитика
                </NavLink>
            </nav>
            <div className="sidebar_user_div">
                <NavLink to={ ROUTES.PROFILE } className="Button nav">
                    <svg className="icon">
                        <use href="#Settings" />
                    </svg>
                    Настройки и профиль
                </NavLink>
            </div>
        </aside>
    );
};
