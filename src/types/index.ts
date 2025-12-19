export type Role = "buyer" | "seller";

export type RegisterForm = {
    name: string;
    email: string;
    password: string;
    role: Role
}

export type LoginForm = Pick<RegisterForm, "email" | "password">

export type VerifyAccountForm = {
    email: string;
    token: string;
}