import { get_endpoint } from "./utils";

export type LoginInfo = {
    id: string,
    name: string,
    email: string,
    token: string
};

const LOGIN_ENDPOINT = "/auth/login";
const REGISTER_ENDPOINT = "/auth/register";

export async function login(email: string, password: string): Promise<LoginInfo | null> {
    const response = await fetch(
        get_endpoint(LOGIN_ENDPOINT),
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        }
    );

    if (response.status !== 200) {
        return null;
    }

    const body = await response.json();

    return {
        id: body.id,
        name: body.name,
        email: body.email,
        token: body.token
    };
}

export type RegisterResult = 
    RegisterInfo | 
    RegisterNameTaken | 
    RegisterEmailTaken | 
    RegisterInvalidRequest;

export type RegisterInfo = {
    type: "success",
    id: string,
    name: string,
    email: string
};

export type RegisterInvalidRequest = {
    type: "invalid-request",
    path: string,
    reason: string
};

export type RegisterNameTaken = {
    type: "name-taken"
};

export type RegisterEmailTaken = {
    type: "email-taken"
};

export async function register(name: string, email: string, password: string): Promise<RegisterResult> {
    const response = await fetch(get_endpoint(REGISTER_ENDPOINT), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
    });

    const body = await response.json();

    if (response.status === 400) {
        return {
            type: "invalid-request",
            path: body.error[0].path,
            reason: body.error[0].reason
        };
    }

    if (response.status === 404) {
        if (body.error_code === 1)
            return { type: "email-taken" };

        if (body.error_code === 2)
            return { type: "name-taken" };
    }

    if (response.status !== 200) {
        throw new Error("invalid response received");
    }

    return {
        type: "success",
        id: body.id,
        name: body.name,
        email: body.email,
    };
}