import React from "react";
import "@assets/scss/index.scss";
import LoginWidget from "@/widgets/Login.tsx";


export default function Login() {

    return (
        <div className="login_div">
            <div className="text_login">
                <div className="login_logo_div">
                    <p className="text logo_title">AI-Ledger</p>
                    <p className="text logo_description">Финансовый трекер</p>
                </div>
                <p className="text title login">Вход в аккаунт</p>
                <p className="text addition_1 auth_note">Введите свои данные для входа</p>
            </div>
            <div className="login">
                <LoginWidget />
            </div>

        </div>
    );
}
