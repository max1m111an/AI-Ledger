import type {
    addPaycheckResponse,
    deletePaychecksResponse,
    GetPaychecksResponse
} from "@interfaces/response/PaychecksResponse.ts";
import axios from "axios";
import { API_ENDPOINTS } from "@/api/ApiConfig.ts";
import type {addPaycheckRequest, deletePaychecksRequest} from "@interfaces/request/PaychecksRequest.ts";

export const paychecksApi = {
    async getPaychecks(): Promise<GetPaychecksResponse> {
        try {
            const response = await axios.get<GetPaychecksResponse>(
                API_ENDPOINTS.PAYCHECKS.GET,
            );

            return response.data;
        } catch (error: any) {
            console.log("Error:", error.response?.data || error.message);
            throw error;
        }
    },

    async addPaycheck(data: addPaycheckRequest): Promise<addPaycheckResponse> {
        try {
            const response = await axios.post<addPaycheckResponse>(
                API_ENDPOINTS.PAYCHECKS.ADD,
                data,
                {
                    headers: {"Content-Type": "application/json"},
                    withCredentials: true,
                },
            );

            return response.data;
        } catch (error) {
            console.error("Error adding paycheck:", error);
            throw error;
        }
    },

    async deletePaychecks(data: deletePaychecksRequest): Promise<deletePaychecksResponse> {
        try {
            const response = await axios.delete<deletePaychecksResponse>(
                API_ENDPOINTS.PAYCHECKS.DELETE,
                {
                    data: data,
                    headers: {"Content-Type": "application/json"},
                    withCredentials: true,
                },
            );

            return response.data;
        } catch (error) {
            console.error("Error deleting paychecks:", error);
            throw error;
        }
    },

    async uploadPaycheckPhoto(file: File): Promise<any> {
        try {
            const formData = new FormData();
            formData.append('paycheck_photo', file, file.name);

            const response = await axios.post(
                API_ENDPOINTS.PAYCHECKS.UPLOAD,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'accept': 'application/json'
                    },
                    withCredentials: true,
                }
            );

            return response.data;
        } catch (error) {
            console.error("Error uploading paycheck photo:", error);
            throw error;
        }
    }
};
