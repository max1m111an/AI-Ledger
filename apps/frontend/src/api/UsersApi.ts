import { API_ENDPOINTS } from "@/api/ApiConfig.ts";
import type {
    GetUserResponse, UpdateUserResponse,
} from "@interfaces/response/UserResponse.ts";
import type { updateUserRequest } from "@interfaces/request/UserRequest.ts";
import api from "@/api/Axios.ts";


export const userApi = {
    async getUser(): Promise<GetUserResponse> {
        try {
            const response = await api.get<GetUserResponse>(
                API_ENDPOINTS.USER.GET,
            );

            return response.data;
        } catch (error: any) {
            console.log("Error:", error.response?.data || error.message);
            throw error;
        }
    },
    async updateUser(data: updateUserRequest): Promise<UpdateUserResponse> {
        try {
            const response = await api.patch<UpdateUserResponse>(
                API_ENDPOINTS.USER.UPDATE,
                data,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                },
            );

            return response.data;
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    },
};
