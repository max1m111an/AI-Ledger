import React, {
    type ChangeEvent, type FormEvent, useState,
} from "react";
import "@assets/scss/index.scss";
import type { LoginRequest } from "@interfaces/request/AuthRequest.ts";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/configs/RoutesConst.ts";
import { login } from "@/services/AuthService.ts";


export default function LoginWidget() {
    const [ loginData, setLoginData ] = useState<LoginRequest>({
        login: "",
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
                <p className="text addition_1 auth_name">Логин</p>
                <input
                    type="text"
                    name="login"
                    value={ loginData.login }
                    placeholder="Введите логин"
                    onChange={ handleChangeField }
                    required />
                <p className="text addition_1 auth_name">Пароль</p>
                <input
                    type="password"
                    name="password"
                    value={ loginData.password }
                    placeholder="Введите пароль"
                    onChange={ handleChangeField }
                    required />
                <div className="links">
                    <p className="text addition_1 links">Забыли пароль?</p>
                    <p className="text addition_1 links">Создать аккаунт</p>
                </div>
                <button className="Button auth"
                    disabled={ loading }
                    type="submit"
                >
                    <svg className="icon">
                        <use href="#Login" />
                    </svg>
                    Войти
                </button>
            </form>
        </>
    );
}
