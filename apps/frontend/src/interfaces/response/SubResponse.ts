import type { Sub } from "@interfaces/models/SubModel.ts";

export interface GetSubsResponse {
    status: number;
    subs: Sub[];
}

export interface addSubResponse {
    status: number;
    sub: Sub;
}

export interface deleteSubsResponse {
    status: number;
}
