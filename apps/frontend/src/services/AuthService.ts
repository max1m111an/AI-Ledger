import * as AuthAPI from "@/api/Auth.mock.ts";
import type { LoginRequest } from "@interfaces/request/AuthRequest.ts";
import { router } from "@/configs/RoutesConfig.tsx";
import {
    LOGIN_CHECK_INTERVAL, ROUTES,
} from "@/configs/RoutesConst.ts";

let updateUserInfoIntervalId: number | undefined;

export const getUserName = () => localStorage.getItem("username") || null;

export const isAuth = () => !!getUserName();

async function updateUserInfo() {
    try {
        const response = await AuthAPI.me();

        if (getUserName() !== response.username) {
            localStorage.setItem("username", response.username);
        }
    } catch (_e) {
        await logout();
    }
}

export async function login(data: LoginRequest) {
    try {
        const response = await AuthAPI.login(data);

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
        await AuthAPI.logout();
        console.log("Success");
    } catch (_e) {
        //@suppress
    } finally {
        localStorage.removeItem("username");
        await router.navigate(ROUTES.LOGIN);

        if (updateUserInfoIntervalId !== undefined) {
            clearInterval(updateUserInfoIntervalId);
            updateUserInfoIntervalId = undefined;
        }
    }
}
