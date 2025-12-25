import { API_ENDPOINTS } from "@/api/ApiConfig.ts";
import type {
    addSubResponse, deleteSubsResponse, GetSubsResponse,
} from "@interfaces/response/SubResponse.ts";
import type {
    addSubRequest, deleteSubsRequest,
} from "@interfaces/request/SubsRequest.ts";
import api from "@/api/Axios.ts";


export const subsApi = {
    async getSubs(): Promise<GetSubsResponse> {
        try {
            const response = await api.get<GetSubsResponse>(
                API_ENDPOINTS.SUBS.GET,
            );

            return response.data;
        } catch (error: any) {
            console.log("Error:", error.response?.data || error.message);
            throw error;
        }
    },

    async addSub(data: addSubRequest): Promise<addSubResponse> {
        try {
            const response = await api.post<addSubResponse>(
                API_ENDPOINTS.SUBS.ADD,
                data,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                },
            );

            return response.data;
        } catch (error) {
            console.error("Error adding sub:", error);
            throw error;
        }
    },

    async deleteSubs(data: deleteSubsRequest): Promise<deleteSubsResponse> {
        try {
            const response = await api.delete<deleteSubsResponse>(
                API_ENDPOINTS.SUBS.DELETE,
                {
                    data: data,
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                },
            );

            return response.data;
        } catch (error) {
            console.error("Error deleting subs:", error);
            throw error;
        }
    },
};
