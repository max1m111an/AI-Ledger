import { refresh } from "@/api/AuthApi.ts";
import { logout } from "@/services/AuthService.ts";
import axios, { type AxiosResponse } from "axios";

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value: AxiosResponse<any>) => void;
    reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(prom as any);
        }
    });
    failedQueue = [];
};

export default async function ExecuteProtectedRequest<T = any>(
    requestCoro: (...args: any[]) => Promise<AxiosResponse<T>>,
    ...args: any[]
): Promise<AxiosResponse<T>> {
    try {
        return await requestCoro(...args);
    } catch (error) {
        if (!axios.isAxiosError(error) || error.response?.status !== 401) {
            throw error;
        }


        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve,
                    reject,
                });
            }).then(() => requestCoro(...args))
                .catch((err) => Promise.reject(err));
        }

        isRefreshing = true;

        try {
            await refresh();
            isRefreshing = false;
            processQueue();

            // Повторяем оригинальный запрос
            return await requestCoro(...args);
        } catch (refreshError) {
            isRefreshing = false;
            processQueue(refreshError);

            // Если refresh не удался - делаем логаут
            await logout();
            throw new Error("Unauthorized");
        }
    }
}
