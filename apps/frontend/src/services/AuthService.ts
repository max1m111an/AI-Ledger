import {
    loginApi, logoutApi, meApi,
} from "@/api/AuthApi";
import type { LoginRequest } from "@interfaces/request/AuthRequest";

export async function login(data: LoginRequest): Promise<boolean> {
    await loginApi(data);

    return true;
}

export async function logout(): Promise<void> {
    await logoutApi();
}

export async function getMe() {
    return await meApi();
}
