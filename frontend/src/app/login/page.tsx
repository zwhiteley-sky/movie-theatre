"use client";

import { useUserInfo } from "@/providers/auth_provider";
import { RedirectType, redirect } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function Page() {
    const [is_disabled, set_disabled] = useState(1);
    const [user_info, login] = useUserInfo();

    useEffect(() => {
        if (user_info) redirect("/");
    }, [user_info]);

    async function submit_handler(event: FormEvent<HTMLFormElement>) {
        // Stop usual event handling
        event.preventDefault();
        event.stopPropagation();

        set_disabled(0);

        const form_data = new FormData(event.currentTarget);

        const email = form_data.get("email") as string;
        const password = form_data.get("password") as string;

        const result = await login(email, password);

        if (result) redirect("/", RedirectType.push);
        else set_disabled(2);
    }

    return (
        <>
            <h1>Login!</h1>
            <form onSubmit={submit_handler}>
                <label>Email:</label>
                <input name="email" type="email" /><br/>

                <label>Password:</label>
                <input name="password" type="password" /><br />

                <input type="submit" value="Login!" disabled={is_disabled === 0} />
                <h2 style={{
                    display: is_disabled === 2 ? "block" : "none",
                    color: "var(--text-error-colour)"
                }}>Invalid username/password</h2>
            </form>
        </>
    );
}