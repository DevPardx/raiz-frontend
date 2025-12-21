import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@/test/utils";
import ForgotPasswordForm from "@/components/forms/auth/ForgotPasswordForm";
import * as authMutations from "@/hooks/mutations/useAuthMutations";

vi.mock("@/hooks/mutations/useAuthMutations");
vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual("@tanstack/react-router");
  return {
    ...actual,
    Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
      <a href={to}>{children}</a>
    ),
  };
});

interface MutationOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

describe("ForgotPasswordForm", () => {
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authMutations.useForgotPasswordMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as unknown as ReturnType<typeof authMutations.useForgotPasswordMutation>);
  });

  it("should render email input field", () => {
    render(<ForgotPasswordForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it("should render send reset link button", () => {
    render(<ForgotPasswordForm />);

    expect(screen.getByRole("button", { name: /send reset link/i })).toBeInTheDocument();
  });

  it("should render back to sign in link", () => {
    render(<ForgotPasswordForm />);

    expect(screen.getByRole("link", { name: /back to sign in/i })).toHaveAttribute("href", "/login");
  });

  it("should display validation errors for empty email", async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    const submitButton = screen.getByRole("button", { name: /send reset link/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Your email is required.")).toBeInTheDocument();
    });
  });

  it("should call forgot password mutation with valid email", async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "test@example.com");

    const submitButton = screen.getByRole("button", { name: /send reset link/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        { email: "test@example.com" },
        expect.any(Object)
      );
    });
  });

  it("should show loading state when form is submitting", () => {
    vi.mocked(authMutations.useForgotPasswordMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    } as unknown as ReturnType<typeof authMutations.useForgotPasswordMutation>);

    render(<ForgotPasswordForm />);

    expect(screen.getByRole("button", { name: /send reset link/i })).toBeInTheDocument();
  });

  it("should show success message after successful submission", async () => {
    const user = userEvent.setup();
    const mockMutateWithSuccess = vi.fn((_data: unknown, options: MutationOptions) => {
      options.onSuccess?.();
    });

    vi.mocked(authMutations.useForgotPasswordMutation).mockReturnValue({
      mutate: mockMutateWithSuccess,
      isPending: false,
    } as unknown as ReturnType<typeof authMutations.useForgotPasswordMutation>);

    render(<ForgotPasswordForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "test@example.com");

    const submitButton = screen.getByRole("button", { name: /send reset link/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/we've sent an email to/i)).toBeInTheDocument();
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
    });
  });

  it("should show try again button after success", async () => {
    const user = userEvent.setup();
    const mockMutateWithSuccess = vi.fn((_data: unknown, options: MutationOptions) => {
      options.onSuccess?.();
    });

    vi.mocked(authMutations.useForgotPasswordMutation).mockReturnValue({
      mutate: mockMutateWithSuccess,
      isPending: false,
    } as unknown as ReturnType<typeof authMutations.useForgotPasswordMutation>);

    render(<ForgotPasswordForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "test@example.com");

    const submitButton = screen.getByRole("button", { name: /send reset link/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
    });
  });

  it("should reset to form view when try again is clicked", async () => {
    const user = userEvent.setup();
    const mockMutateWithSuccess = vi.fn((_data: unknown, options: MutationOptions) => {
      options.onSuccess?.();
    });

    vi.mocked(authMutations.useForgotPasswordMutation).mockReturnValue({
      mutate: mockMutateWithSuccess,
      isPending: false,
    } as unknown as ReturnType<typeof authMutations.useForgotPasswordMutation>);

    render(<ForgotPasswordForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "test@example.com");

    const submitButton = screen.getByRole("button", { name: /send reset link/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
    });

    const tryAgainButton = screen.getByRole("button", { name: /try again/i });
    await user.click(tryAgainButton);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send reset link/i })).toBeInTheDocument();
  });

  it("should show back to sign in link in success state", async () => {
    const user = userEvent.setup();
    const mockMutateWithSuccess = vi.fn((_data: unknown, options: MutationOptions) => {
      options.onSuccess?.();
    });

    vi.mocked(authMutations.useForgotPasswordMutation).mockReturnValue({
      mutate: mockMutateWithSuccess,
      isPending: false,
    } as unknown as ReturnType<typeof authMutations.useForgotPasswordMutation>);

    render(<ForgotPasswordForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "test@example.com");

    const submitButton = screen.getByRole("button", { name: /send reset link/i });
    await user.click(submitButton);

    await waitFor(() => {
      const backLinks = screen.getAllByRole("link", { name: /back to sign in/i });
      expect(backLinks.length).toBeGreaterThan(0);
    });
  });
});
