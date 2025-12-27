import { register, verifyAccount, resendVerificationCode, login, logout, forgotPassword, resetPassword } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useAuthStore } from "@/store/authStore";

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
    const checkAuth = useAuthStore((state) => state.checkAuth);

    return useMutation({
        mutationFn: login,
        onSuccess: async () => {
            await checkAuth();
        }
    });
};

export const useLogoutMutation = () => {
    const router = useRouter();
    const clearAuth = useAuthStore((state) => state.clearAuth);

    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            clearAuth();
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