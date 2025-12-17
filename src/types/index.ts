export type Role = "buyer" | "seller";

export type RegisterForm = {
    name: string;
    email: string;
    password: string;
    role: Role
}