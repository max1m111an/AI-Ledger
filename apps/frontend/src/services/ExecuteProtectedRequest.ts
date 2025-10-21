import axios from "axios";
import type { AxiosResponse } from "axios";
import { refresh } from "@/api/AuthApi.ts";
import { logout } from "@/services/AuthService.ts";

export default async function ExecuteProtectedRequest<T = any>(requestCoro: (...args: any[]) => Promise<AxiosResponse<T>>, ...args: any[]): Promise<AxiosResponse<T>> {
    try {
        return await requestCoro(...args);
    } catch (e) {
        if (!axios.isAxiosError(e) || e.response?.status !== 401) {
            throw e;
        }

        await refresh();

        try {
            return await requestCoro(...args);
        } catch (e) {
            if (!axios.isAxiosError(e) || e.response?.status !== 401) {
                throw e;
            }

            await logout();
            throw new Error("Unauthorized");
        }
    }
}
