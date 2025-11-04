import axios, { AxiosError } from "axios";
import type { LoginResponse, RegisterResponse } from "@interfaces/response/AuthResponse.ts";
import type { LoginRequest, RegisterRequest } from "@interfaces/request/AuthRequest.ts";
import { API_ENDPOINTS } from "@/api/ApiConfig.ts";
import ExecuteProtectedRequest from "@/services/ExecuteProtectedRequest.ts";


export async function loginApi(data: LoginRequest): Promise<LoginResponse> {
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

export async function registerApi(data: RegisterRequest): Promise<RegisterResponse> {
    try {
        const response = await axios.post<RegisterResponse>(
            `${API_ENDPOINTS.AUTH.REGISTER}`,
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

        if (error.response?.status === 400) {
            throw new Error("Bad request: Invalid registration data");
        }

        if (error.response?.status === 409) {
            throw new Error("User already exists");
        }

        throw new Error("Unexpected error during registration");
    }
}

export async function logoutApi() {
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
            {},
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        return response.data;
    } catch (_error) {
        throw new Error("Unexpected error during refresh");
    }
}


export async function meApi(): Promise<LoginResponse> {
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
