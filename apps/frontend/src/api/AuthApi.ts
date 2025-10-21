import axios, { AxiosError } from "axios";
import type { LoginResponse } from "@interfaces/response/AuthResponse.ts";
import type { LoginRequest } from "@interfaces/request/AuthRequest.ts";
import { API_ENDPOINTS } from "@/api/ApiConfig.ts";
import ExecuteProtectedRequest from "@/services/ExecuteProtectedRequest.ts";


export async function login(data: LoginRequest): Promise<LoginResponse> {
    try {
        const response = await axios.post<LoginResponse>(
            `${API_ENDPOINTS.AUTH.LOGIN}`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            },
        );

        return response.data;
    } catch (e) {
        const error = e as AxiosError;

        if (error.response?.status === 401) {
            throw new Error("Unauthorized");
        }

        throw new Error("Unexpected error during login");
    }
}

export async function logout() {
    return await axios.delete<LoginResponse>(
        `${API_ENDPOINTS.AUTH.LOGOUT}`,
        {
            withCredentials : true,
        },
    );
}

export async function refresh(): Promise<LoginResponse> {
    try {
        const response = await axios.post<LoginResponse>(
            `${API_ENDPOINTS.AUTH.REFRESH}`,
            {
                withCredentials : true,
            },
        );

        return response.data;
    } catch (_error) {
        throw new Error("Unexpected error during refresh");
    }
}

export async function me(): Promise<LoginResponse> {
    const response = await ExecuteProtectedRequest<LoginResponse>(
        async() => axios.get<LoginResponse>(
            `${API_ENDPOINTS.AUTH.ME}`,
            {
                withCredentials : true,
            },
        ),
    );

    return response.data;
}
