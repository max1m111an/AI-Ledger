import type {
    LoginResponse, MeResponse,
} from "@interfaces/response/AuthResponse.ts";

export async function logout() {
}

export async function refresh(): Promise<LoginResponse> {
    return { status: 200 };
}

export async function me(): Promise<MeResponse> {
    return { username: "ADMIN" };
}
