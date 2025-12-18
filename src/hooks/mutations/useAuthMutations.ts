import { register, verifyAccount, resendVerificationCode } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";

export const useRegisterMutation = () => {
    return useMutation({
        mutationFn: register
    });
};

export const useVerifyAccountMutation = () => {
    return useMutation({
        mutationFn: verifyAccount
    });
};

export const useResendCodeMutation = () => {
    return useMutation({
        mutationFn: resendVerificationCode
    });
};