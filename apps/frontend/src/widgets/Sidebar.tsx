import React from "react";
import "@assets/scss/index.scss";
import { NavLink } from "react-router-dom";
import { ROUTES } from "@/configs/RoutesConst.ts";

export const Sidebar: React.FC = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar_logo_div">
                <p className="text logo_title">AI-Ledger</p>
                <p className="text logo_description">Финансовый трекер</p>
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
