import type { LoginRequest } from "@interfaces/request/AuthRequest.ts";
import {
    LOGIN_CHECK_INTERVAL, ROUTES,
} from "@/configs/RoutesConst.ts";
import {
    loginApi, logoutApi,
} from "@/api/AuthApi.ts";
import { me } from "@/api/Auth.mock.ts";

let updateUserInfoIntervalId: number | undefined;

export const getUserName = () => localStorage.getItem("username") || null;

export const isAuth = () => !!getUserName();

async function updateUserInfo() {
    try {
        const response = await me();

        if (getUserName() !== response.username) {
            localStorage.setItem("username", response.username);
        }
    } catch (_e) {
        await logout();
    }
}

export async function login(data: LoginRequest) {
    try {
        const response = await loginApi(data);

        if (response.status !== 200) {
            return false;
        }

        await updateUserInfo();

        if (updateUserInfoIntervalId === undefined) {
            updateUserInfoIntervalId = window.setInterval(updateUserInfo, LOGIN_CHECK_INTERVAL);
        }

        return true;

    } catch (e) {
        const error = e as Error;

        if (error.message === "Unauthorized") {
            return false;
        }

        throw e;
    }
}

export async function logout() {
    try {
        await logoutApi();
        console.log("Success logout");
    } catch (_e) {
        console.error("Logout error:", _e);
    } finally {
        // Очищаем все данные авторизации
        localStorage.removeItem("username");

        // Останавливаем интервал
        if (updateUserInfoIntervalId !== undefined) {
            clearInterval(updateUserInfoIntervalId);
            updateUserInfoIntervalId = undefined;
        }

        // Перенаправляем на логин
        window.location.href = ROUTES.LOGIN;
        // Или через router, если он доступен
        // await router.navigate(ROUTES.LOGIN);
    }
}
