import React, {
    useState, type ChangeEvent, type FormEvent, useEffect,
} from "react";
import "@assets/scss/index.scss";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/configs/RoutesConst.ts";
import { userApi,
} from "@/api/UsersApi.ts";
import type {updateUserRequest} from "@interfaces/request/UserRequest.ts";

interface SettingsProfileProps {
    className?: string;
}

export default function SettingsProfile({ className }: SettingsProfileProps) {
    const [ userData, setUserData ] = useState({
        id: 0,
        name: "",
        email: "",
        password: "",
        daily_limit: 0,
    });

    const [ isLoading, setIsLoading ] = useState(true);
    const [ editMode, setEditMode ] = useState(false);
    const [ tempUserData, setTempUserData ] = useState(userData);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async() => {
        try {
            setIsLoading(true);
            const response = await userApi.getUser();

            if (response.status === 200 && response.user) {
                const newUserData = {
                    id: response.user.id || 0,
                    name: response.user.name || "",
                    email: response.user.email || "",
                    password: "",
                    daily_limit: response.user.daily_limit || 0,
                };

                setUserData(newUserData);
                setTempUserData(newUserData);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {
            name, value,
        } = e.target;
        setTempUserData((prev) => ({
            ...prev,
            [name]: name === "daily_limit" ? parseInt(value) || 0 : value,
        }));
    };

    const handleSave = async(e: FormEvent) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            const updateData: updateUserRequest = {
                id: tempUserData.id,
                name: tempUserData.name,
                email: tempUserData.email,
                password: tempUserData.password,
                daily_limit: tempUserData.daily_limit,
            };

            const response = await userApi.updateUser(updateData);

            if (response.status === 200) {
                setUserData({
                    id: response.user.id,
                    name: response.user.name,
                    email: response.user.email,
                    password: "",
                    daily_limit: response.user.daily_limit,
                });
                setEditMode(false);
            }
        } catch (error) {
            console.error("Error updating user:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setTempUserData({
            ...userData,
            password: "",
        });
        setEditMode(false);
    };

    const handleLogout = async() => {
        navigate(ROUTES.LOGIN);
    };

    if (isLoading && !userData.name) {
        return (
            <div className={ `page ${className || ""}` }>
                <div className="action_block_1 w_g70">
                    <div className="today title_div">
                        <span className="title">Настройки профиля</span>
                        <span className="addition_2">
                            <svg className="icon">
                                <use href="#Settings" />
                            </svg>
                            Загрузка данных...
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page jc-c">
            <div className="action_block_1">
                <div>
                    <span className="title">Настройки профиля</span>
                    <span className="addition_3 mt-5 mb-10">
                        <svg className="icon">
                            <use href="#Settings" />
                        </svg>
                        Управление вашими данными
                    </span>
                </div>

                <form onSubmit={ handleSave } className="form fg-1">
                    <div>
                        <div className="addition_2 fs-12 fw-500 mt-15 mb-5">Имя</div>
                        {editMode ? (
                            <input
                                type="text"
                                name="name"
                                value={ tempUserData.name }
                                onChange={ handleInputChange }
                                placeholder="Введите имя"
                                required
                                disabled={ isLoading }
                            />
                        ) : (
                            <div className="addition_1">
                                {userData.name || "Не указано"}
                            </div>
                        )}
                    </div>

                    <div className="addition_2 fs-12 fw-500 mt-15 mb-5">Email</div>
                    {editMode ? (
                        <input
                            type="email"
                            name="email"
                            value={ tempUserData.email }
                            onChange={ handleInputChange }
                            placeholder="Введите email"
                            className="form-input"
                            required
                            disabled={ isLoading }
                        />
                    ) : (
                        <div className="addition_1">
                            {userData.email || "Не указано"}
                        </div>
                    )}

                    <div className="addition_2 fs-12 fw-500 mt-15 mb-5">Пароль</div>
                    {editMode ? (
                        <input
                            type="password"
                            name="password"
                            value={ tempUserData.password }
                            onChange={ handleInputChange }
                            placeholder="Введите новый пароль"
                            className="form-input"
                            disabled={ isLoading }
                        />
                    ) : (
                        <div className="addition_1">
                            Неизвестно
                        </div>
                    )}

                    <div className="addition_2 fs-12 fw-500 mt-15 mb-5">Ежедневный лимит</div>
                    {editMode ? (
                        <input
                            type="number"
                            name="daily_limit"
                            value={ tempUserData.daily_limit }
                            onChange={ handleInputChange }
                            placeholder="Установите лимит"
                            className="form-input"
                            min="0"
                            step="100"
                            required
                            disabled={ isLoading }
                        />
                    ) : (
                        <div className="addition_1">
                            {userData.daily_limit.toLocaleString()} ₽
                        </div>
                    )}

                    <div className="">
                        {editMode ? (
                            <div className="">
                                <button
                                    type="submit"
                                    className="Button auth"
                                    disabled={ isLoading }
                                >
                                    {isLoading ? "Сохранение..." : "Сохранить изменения"}
                                </button>
                                <button
                                    type="button"
                                    className="Button auth"
                                    onClick={ handleCancel }
                                    disabled={ isLoading }
                                >
                                    Отмена
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                className="Button auth"
                                onClick={ () => setEditMode(true) }
                                disabled={ isLoading }
                            >
                                Редактировать профиль
                            </button>
                        )}
                    </div>
                    <button
                        type="button"
                        className="Button auth"
                        onClick={ handleLogout }
                        disabled={ isLoading }
                    >
                        Выйти из аккаунта
                    </button>
                </form>
            </div>
        </div>
    );
}
