import { register, verifyAccount, resendVerificationCode, login, logout, forgotPassword, resetPassword } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

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

export const useLoginMutation = () => {
    return useMutation({
        mutationFn: login
    });
};

export const useLogoutMutation = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            router.navigate({ to: "/login" });
        }
    });
};

export const useForgotPasswordMutation = () => {
    return useMutation({
        mutationFn: forgotPassword
    });
};

export const useResetPasswordMutation = () => {
    return useMutation({
        mutationFn: resetPassword
    });
};