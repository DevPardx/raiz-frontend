import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@/test/utils";
import ResetPasswordForm from "@/components/forms/auth/ResetPasswordForm";
import * as authMutations from "@/hooks/mutations/useAuthMutations";

vi.mock("@/hooks/mutations/useAuthMutations");
vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual("@tanstack/react-router");
  return {
    ...actual,
    useRouter: () => ({
      navigate: vi.fn(),
    }),
    useParams: () => ({
      token: "test-reset-token",
    }),
  };
});

describe("ResetPasswordForm", () => {
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authMutations.useResetPasswordMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as unknown as ReturnType<typeof authMutations.useResetPasswordMutation>);
  });

  it("should render password input fields", () => {
    render(<ResetPasswordForm />);

    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it("should render reset password button", () => {
    render(<ResetPasswordForm />);

    expect(screen.getByRole("button", { name: /reset password/i })).toBeInTheDocument();
  });

  it("should toggle password visibility for both fields", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm />);

    const newPasswordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    expect(newPasswordInput).toHaveAttribute("type", "password");
    expect(confirmPasswordInput).toHaveAttribute("type", "password");

    const toggleButtons = screen.getAllByRole("button", { name: "" });
    await user.click(toggleButtons[0]);

    expect(newPasswordInput).toHaveAttribute("type", "text");
    expect(confirmPasswordInput).toHaveAttribute("type", "text");
  });

  it("should display validation errors for empty fields", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm />);

    const submitButton = screen.getByRole("button", { name: /reset password/i });
    await user.click(submitButton);

    await waitFor(() => {
      const errorMessages = screen.getAllByText("The password is required.");
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });

  it("should display validation error for short password", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm />);

    const newPasswordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    await user.type(newPasswordInput, "short");
    await user.type(confirmPasswordInput, "short");

    const submitButton = screen.getByRole("button", { name: /reset password/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("The password must contain at least 8 characters.")).toBeInTheDocument();
    });
  });

  it("should display validation error when passwords do not match", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm />);

    const newPasswordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    await user.type(newPasswordInput, "password123");
    await user.type(confirmPasswordInput, "password456");

    const submitButton = screen.getByRole("button", { name: /reset password/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });
  });

  it("should call reset password mutation with valid data", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm />);

    const newPasswordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    await user.type(newPasswordInput, "newpassword123");
    await user.type(confirmPasswordInput, "newpassword123");

    const submitButton = screen.getByRole("button", { name: /reset password/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        {
          newPassword: "newpassword123",
          confirmPassword: "newpassword123",
          token: "test-reset-token",
        },
        expect.any(Object)
      );
    });
  });

  it("should show loading state when form is submitting", () => {
    vi.mocked(authMutations.useResetPasswordMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    } as unknown as ReturnType<typeof authMutations.useResetPasswordMutation>);

    render(<ResetPasswordForm />);

    expect(screen.getByRole("button", { name: /reset password/i })).toBeInTheDocument();
  });

  it("should validate password match on submission attempt", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm />);

    const newPasswordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    await user.type(newPasswordInput, "password123");
    await user.type(confirmPasswordInput, "password456");

    const submitButton = screen.getByRole("button", { name: /reset password/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });
  });
});
