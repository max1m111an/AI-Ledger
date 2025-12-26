import React, {
    type ChangeEvent, type FormEvent, useState,
} from "react";
import "@assets/scss/index.scss";
import type { LoginRequest } from "@interfaces/request/AuthRequest.ts";
import {
    NavLink, useNavigate,
} from "react-router-dom";
import { ROUTES } from "@/configs/RoutesConst.ts";
import { login } from "@/services/AuthService.ts";


export default function LoginWidget() {
    const [ loginData, setLoginData ] = useState<LoginRequest>({
        enter_data: "",
        password: "",
    });
    const [ _error, setError ] = useState<string | null>(null);
    const [ loading, setLoading ] = useState(false);

    const navigate = useNavigate();

    const handleChangeField = (e: ChangeEvent<HTMLInputElement>) => {
        const {
            name, value,
        } = e.target;
        setLoginData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async(e: FormEvent) => {
        e.preventDefault();
        setError(null);
        console.log(343434334);
        setLoading(true);
        try {
            if (await login(loginData)) {
                navigate(ROUTES.MAIN);
            } else {
                setError("Неверное имя пользователя или пароль");
            }
        } catch (e) {
            setError("Неизвестная ошибка: " + e);
        }

        setLoading(false);
    };

    return (
        <>
            <form onSubmit={ handleSubmit } className="form">
                <div className="addition_2 fs-12 fw-500 mt-15 mb-5">Логин</div>
                <input
                    type="text"
                    name="enter_data"
                    value={ loginData.enter_data }
                    placeholder="Введите логин"
                    onChange={ handleChangeField }
                    required />
                <div className="addition_2 fs-12 fw-500 mt-15 mb-5">Пароль</div>
                <input
                    type="password"
                    name="password"
                    value={ loginData.password }
                    placeholder="Введите пароль"
                    onChange={ handleChangeField }
                    required />
                <div className="links">
                    <p className="links fs-12">Забыли пароль?</p>
                    <NavLink to={ ROUTES.REGISTRATION } className="links fs-12">Создать аккаунт</NavLink>
                </div>
                <button className="Button auth"
                    disabled={ loading }
                    type="submit"
                >
                    <svg className="icon">
                        <use href="#LoginPage" />
                    </svg>
                    Войти
                </button>
            </form>
        </>
    );
}
