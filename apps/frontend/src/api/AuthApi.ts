import api from "./Axios";
import { API_ENDPOINTS } from "./ApiConfig";
import type {
    LoginRequest, RegisterRequest,
} from "@interfaces/request/AuthRequest";
import type {
    LoginResponse, RegisterResponse, MeResponse,
} from "@interfaces/response/AuthResponse";

export async function loginApi(data: LoginRequest): Promise<LoginResponse> {
    const res = await api.post(API_ENDPOINTS.AUTH.LOGIN, data);

    return res.data;
}

export async function registerApi(data: RegisterRequest): Promise<RegisterResponse> {
    const res = await api.post(API_ENDPOINTS.AUTH.REGISTER, data);

    return res.data;
}

export async function logoutApi(): Promise<void> {
    await api.delete(API_ENDPOINTS.AUTH.LOGOUT);
}

export async function refresh(): Promise<LoginResponse> {
    const res = await api.post(API_ENDPOINTS.AUTH.REFRESH, {});

    return res.data;
}

export async function meApi(): Promise<MeResponse> {
    const res = await api.get(API_ENDPOINTS.AUTH.ME);

    return res.data;
}
