import type { Paycheck } from "@interfaces/models/PaychecksModel.ts";
import type { Sub } from "@interfaces/models/SubModel.ts";

export interface User {
    id: number;
    name: string;
    daily_limit: number;
    email: string;
    subs: Sub[];
    paychecks: Paycheck[];
}
