import { api } from "@/lib/axios";
import type { RegisterForm, VerifyAccountForm } from "@/types";
import { isAxiosError } from "axios";
import i18n from "@/i18n/config";

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