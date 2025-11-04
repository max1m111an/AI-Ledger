export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: "/api/user/login",
        LOGOUT: "/api/user/logout",
        REFRESH: "/api/user/token/refresh",
        ME: "/api/user/me",
        REGISTER: "/api/users/register",
    },
    USER: {
        REGISTER: "/api/user/register",
        GET: "api/users/",
        UPDATE: "/api/users/edit",

    },
    PAYCHECKS: {
        GET: "api/paychecks/",
        ADD: "api/paychecks/add",
        DELETE: "api/paychecks/remove",
        UPLOAD: "api/paychecks/photo",
    },
    SUBS: {
        GET: "api/subs/",
        ADD: "api/subs/add",
        DELETE: "api/subs/remove",
    },
};
