export interface addPaycheckRequest {
    name: string;
    price: number;
    pay_date: number;
    category: string;
}

export interface deletePaychecksRequest {
    id: number[];
}
