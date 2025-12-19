import { isAxiosError } from "axios";
import i18n from "@/i18n/config";
import { api } from "@/lib/axios";
import type { LoginForm, RegisterForm, VerifyAccountForm } from "@/types";

export const register = async (formData: RegisterForm) => {
    try{
        const { data } = await api.post<string>("/auth/register", formData);
        return data;
    }
    catch(error){
        if(isAxiosError(error) && error.response?.data){
            throw new Error(error.response.data.error || i18n.t("register_error"));
        }

        throw new Error(i18n.t("register_error"));
    }
};

export const verifyAccount = async (formData: VerifyAccountForm) => {
    try{
        const { data } = await api.post<string>("/auth/verify-account", formData);
        return data;
    }
    catch(error){
        if(isAxiosError(error) && error.response?.data){
            throw new Error(error.response.data.error || i18n.t("verify_account_error"));
        }

        throw new Error(i18n.t("verify_account_error"));
    }
};

export const resendVerificationCode = async (email: string) => {
    try{
        const { data } = await api.post<string>("/auth/resend-verification-code", { email });
        return data;
    }
    catch(error){
        if(isAxiosError(error) && error.response?.data){
            throw new Error(error.response.data.error || i18n.t("resend_code_error"));
        }

        throw new Error(i18n.t("resend_code_error"));
    }
};

export const login = async (formData: LoginForm) => {
    try{
        // Los tokens se envían automáticamente como httpOnly cookies
        // El backend no devuelve nada en el body
        await api.post("/auth/login", formData);
    }
    catch(error){
        if(isAxiosError(error) && error.response?.data){
            throw new Error(error.response.data.error || i18n.t("login_error"));
        }

        throw new Error(i18n.t("login_error"));
    }
};

export const logout = async () => {
    try {
        await api.post("/auth/logout");
        localStorage.removeItem("pendingVerificationEmail");
    } catch (error) {
        if(isAxiosError(error) && error.response?.data){
            throw new Error(error.response.data.error || i18n.t("logout_error"));
        }

        throw new Error(i18n.t("logout_error"));
    }
};

export const refreshToken = async () => {
    try {
        const { data } = await api.post<{ message: string }>("/auth/refresh");
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response?.status === 401) {
            throw new Error(i18n.t("Session expired"));
        }
        throw error;
    }
};