export type Role = "buyer" | "seller";

export type RegisterForm = {
    name: string;
    email: string;
    password: string;
    role: Role
}

export type VerifyAccountForm = {
    email: string;
    token: string;
}