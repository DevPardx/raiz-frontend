import { api } from "@/lib/axios";
import type { RegisterForm } from "@/types";
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