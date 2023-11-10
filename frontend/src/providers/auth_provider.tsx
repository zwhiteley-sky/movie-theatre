"use client";

import { LoginInfo, login as api_login } from "@/lib/api";
import { createContext, useEffect, useState, useContext } from "react";

export type UserInfo = LoginInfo;

const STORAGE_KEY = "auth";

const auth_context = createContext(
    null as UserInfo | null
);

const set_auth_context = createContext(
    null as ((info: UserInfo | null) => void) | null
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user_info, set_user_info] = useState(
        null as UserInfo | null
    );

    useEffect(() => {
        const user_info_str = localStorage.getItem(STORAGE_KEY);

        if (!user_info_str) return;

        const user_info = JSON.parse(user_info_str) as UserInfo;
        
        // TODO: Add expiry check
        set_user_info(user_info);
    }, []);

    return (
        <auth_context.Provider value={user_info}>
            <set_auth_context.Provider value={set_user_info}>
                {children}
            </set_auth_context.Provider>
        </auth_context.Provider>
    );
}

export function useUserInfo(): [
    UserInfo | null, 
    (email: string, password: string) => Promise<UserInfo | null>,
    () => void
    ] {
    const user_info = useContext(auth_context);
    const set_user_info = useContext(set_auth_context);

    async function login(email: string, password: string): Promise<UserInfo | null> {
        const result = await api_login(email, password);

        if (result) {
            // If the login was successful, store the item
            localStorage.setItem(
                STORAGE_KEY, 
                JSON.stringify(result)
            );

            set_user_info!(result);
        }

        return result;
    }

    function logout() {
        localStorage.removeItem(STORAGE_KEY);
        set_user_info!(null);
    }

    return [user_info, login, logout];
}