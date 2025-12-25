import { isAxiosError } from "axios";
import i18n from "@/i18n/config";
import { api } from "@/lib/axios";
import { propertySchema } from "@/schemas/property.schema";

export const getProperties = async () => {
    try{
        const { data } = await api.get("/properties");

        const response = propertySchema.safeParse(data);

        if (!response.success) {
            throw new Error(i18n.t("invalid_data_format"));
        }

        return response.data;
    }
    catch(error){
        if(isAxiosError(error) && error.response?.data){
            throw new Error(error.response.data.error || i18n.t("properties_error"));
        }

        throw new Error(i18n.t("properties_error"));
    }
};