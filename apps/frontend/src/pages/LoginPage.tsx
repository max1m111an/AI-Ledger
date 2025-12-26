import React from "react";
import "@assets/scss/index.scss";
import LoginWidget from "@/widgets/LoginWidget.tsx";


export default function LoginPage() {

    return (
        <div className="login_div">
            <div className="text_login">
                <div className="login_logo_div">
                    <span className="addition_1 u-pl-15">AI-Ledger</span>
                    <span className="addition_2 u-pl-15 fs-12">Финансовый трекер</span>
                </div>
                <span className="title fs-24 mt-10">Вход в аккаунт</span>
                <div className="addition_2 fw-500 mt-10 mb-10">Введите свои данные для входа</div>
            </div>
            <div className="login">
                <LoginWidget />
            </div>
        </div>
    );
}
