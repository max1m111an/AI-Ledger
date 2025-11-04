import React, {
    type ChangeEvent, type FormEvent, useState,
} from "react";
import "@assets/scss/index.scss";
import {
    NavLink, useNavigate,
} from "react-router-dom";
import { ROUTES } from "@/configs/RoutesConst.ts";
import {registerApi} from "@/api/AuthApi.ts";

export default function RegistrationWidget() {
    const [ registrationData, setRegistrationData ] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [ error, setError ] = useState<string | null>(null);
    const [ loading, setLoading ] = useState(false);

    const navigate = useNavigate();

    const handleChangeField = (e: ChangeEvent<HTMLInputElement>) => {
        const {
            name, value,
        } = e.target;
        setRegistrationData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async(e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // Валидация паролей
        if (registrationData.password !== registrationData.confirmPassword) {
            setError("Пароли не совпадают");
            setLoading(false);
            return;
        }

        // Валидация длины пароля
        if (registrationData.password.length < 6) {
            setError("Пароль должен содержать минимум 6 символов");
            setLoading(false);
            return;
        }

        try {
            // Вызов API регистрации
            const response = await registerApi({
                name: registrationData.name,
                email: registrationData.email,
                password: registrationData.password
            });

            console.log("Registration successful:", response);

            navigate(ROUTES.MAIN);

        } catch (err: any) {
            if (err.message === "User already exists") {
                setError("Пользователь с таким email уже существует");
            } else if (err.message === "Bad request: Invalid registration data") {
                setError("Некорректные данные регистрации");
            } else if (err.response?.status === 400) {
                setError("Некорректные данные. Проверьте введённую информацию");
            } else if (err.response?.status === 409) {
                setError("Пользователь с таким email уже зарегистрирован");
            } else {
                setError("Ошибка при регистрации. Попробуйте позже");
            }
            console.error("Registration error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={ handleSubmit } className="form">
            <div className="addition_2 fs-12 fw-500 mt-15 mb-5">Имя пользователя</div>
            <input
                type="text"
                name="name" // Изменено с username на name
                value={ registrationData.name }
                placeholder="Введите имя пользователя"
                onChange={ handleChangeField }
                required
                disabled={ loading }
            />

            <div className="addition_2 fs-12 fw-500 mt-15 mb-5">Email</div>
            <input
                type="email"
                name="email"
                value={ registrationData.email }
                placeholder="Введите email"
                onChange={ handleChangeField }
                required
                disabled={ loading }
            />

            <div className="addition_2 fs-12 fw-500 mt-15 mb-5">Пароль</div>
            <input
                type="password"
                name="password"
                value={ registrationData.password }
                placeholder="Введите пароль (минимум 6 символов)"
                onChange={ handleChangeField }
                required
                disabled={ loading }
                minLength={6}
            />

            <div className="addition_2 fs-12 fw-500 mt-15 mb-5">Подтвердите пароль</div>
            <input
                type="password"
                name="confirmPassword"
                value={ registrationData.confirmPassword }
                placeholder="Повторите пароль"
                onChange={ handleChangeField }
                required
                disabled={ loading }
            />

            {/* Отображение ошибки */}
            {error && (
                <div className="error-message" style={{
                    color: "var(--red-text-color)",
                    backgroundColor: "var(--red-background)",
                    border: "var(--red-border)",
                    padding: "10px",
                    borderRadius: "8px",
                    margin: "10px 0",
                    fontSize: "14px"
                }}>
                    {error}
                </div>
            )}

            <div className="links">
                <NavLink to={ ROUTES.LOGIN } className="links fs-12" style={{ pointerEvents: loading ? "none" : "auto" }}>
                    Уже есть аккаунт?
                </NavLink>
            </div>

            <button
                className="Button auth"
                disabled={ loading }
                type="submit"
            >
                {loading ? "Регистрация..." : "Зарегистрироваться"}
            </button>
        </form>
    );
}
