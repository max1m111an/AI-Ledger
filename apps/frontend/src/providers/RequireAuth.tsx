import React from "react";
import { Navigate } from "react-router-dom";
import { isAuth } from "@/services/AuthService.ts";

interface IRequireAuthProps {
    fallbackURL: string;
    children: React.ReactElement;
}

export default function RequireAuth({
    children, fallbackURL,
}: IRequireAuthProps) {
    return isAuth() ? <>{children}</> : <Navigate to={ fallbackURL } replace />;
}
