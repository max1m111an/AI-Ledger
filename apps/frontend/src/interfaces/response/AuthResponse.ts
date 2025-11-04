export interface LoginResponse{
    status: number;
}

export interface MeResponse{
    username: string;
}

export interface LoginResponse {
    status: number;
    user: {
        id: number;
        name: string;
        daily_limit: number | null;
        email: string;
        subs: any[];
        paychecks: any[];
    };
}

export interface RegisterResponse {
    status: number;
    user: {
        id: number;
        name: string;
        daily_limit: number | null;
        email: string;
        subs: any[];
        paychecks: any[];
    };
}
