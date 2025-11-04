import type { User } from "@interfaces/models/UserModel.ts";

export interface GetUserResponse {
    status: number;
    user: User;
}

export interface UpdateUserResponse {
    status: number;
    user: User;
}

