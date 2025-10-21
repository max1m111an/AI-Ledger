import React, {
    type FormEvent, useEffect, useState,
} from "react";
import "@assets/scss/index.scss";
import {
    getUserName, isAuth, logout,
} from "@/services/AuthService.ts";


export default function ProfileWidget() {
    const [ _currentUser, setCurrentUser ] = useState<string | null>(getUserName);

    useEffect(() => {
        if (isAuth()) {
            setCurrentUser(getUserName());
        }
    }, []);

    const handleSubmit = async(e: FormEvent) => {
        e.preventDefault();
        await logout();
        setCurrentUser(null);
    };

    return (
        <>
            <button onClick={ handleSubmit }>Выйти</button>
        </>
    );
}
