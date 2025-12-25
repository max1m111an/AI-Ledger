export interface LoginResponse{
    status: number;
}

export interface MeResponse{
    user_data: string;
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
