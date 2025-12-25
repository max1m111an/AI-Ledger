import type { Paycheck } from "@interfaces/models/PaychecksModel.ts";

export interface GetPaychecksResponse {
    status: number;
    paychecks: Paycheck[];
}

export interface addPaycheckResponse {
    status: number;
    paycheck: {
        name: string;
        category: string;
        user_id: number;
        price: number;
        pay_date: number;
        id: number;
    };
}


export interface deletePaychecksResponse {
    status: number;
}

