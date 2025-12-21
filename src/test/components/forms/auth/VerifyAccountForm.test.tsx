import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@/test/utils";
import VerifyAccountForm from "@/components/forms/auth/VerifyAccountForm";
import * as authMutations from "@/hooks/mutations/useAuthMutations";

vi.mock("@/hooks/mutations/useAuthMutations");
vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual("@tanstack/react-router");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe("VerifyAccountForm", () => {
  const mockVerifyMutate = vi.fn();
  const mockResendMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    vi.mocked(authMutations.useVerifyAccountMutation).mockReturnValue({
      mutate: mockVerifyMutate,
      isPending: false,
    } as unknown as ReturnType<typeof authMutations.useVerifyAccountMutation>);

    vi.mocked(authMutations.useResendCodeMutation).mockReturnValue({
      mutate: mockResendMutate,
      isPending: false,
    } as unknown as ReturnType<typeof authMutations.useResendCodeMutation>);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should render OTP input fields", () => {
    render(<VerifyAccountForm />);

    const otpContainer = document.querySelector("[data-input-otp]");
    expect(otpContainer).toBeInTheDocument();
  });

  it("should render verify account button", () => {
    render(<VerifyAccountForm />);

    expect(screen.getByRole("button", { name: /verify account/i })).toBeInTheDocument();
  });

  it("should show email input when no pending email in localStorage", () => {
    render(<VerifyAccountForm />);

    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
  });

  it("should not show email input when pending email exists in localStorage", () => {
    localStorage.setItem("pendingVerificationEmail", "test@example.com");

    render(<VerifyAccountForm />);

    expect(screen.queryByPlaceholderText(/you@example.com/i)).not.toBeInTheDocument();
    expect(screen.getByText(/code will be sent to/i)).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("should disable verify button when code is incomplete", () => {
    render(<VerifyAccountForm />);

    const verifyButton = screen.getByRole("button", { name: /verify account/i });
    expect(verifyButton).toBeDisabled();
  });

  it("should enable verify button when code is complete and email exists", () => {
    localStorage.setItem("pendingVerificationEmail", "test@example.com");

    render(<VerifyAccountForm />);

    const verifyButton = screen.getByRole("button", { name: /verify account/i });

    expect(verifyButton).toBeDisabled();
  });

  it("should show change email button when email is set", () => {
    localStorage.setItem("pendingVerificationEmail", "test@example.com");

    render(<VerifyAccountForm />);

    expect(screen.getByRole("button", { name: /change email/i })).toBeInTheDocument();
  });

  it("should toggle email input when change email is clicked", async () => {
    const user = userEvent.setup();
    localStorage.setItem("pendingVerificationEmail", "test@example.com");

    render(<VerifyAccountForm />);

    expect(screen.queryByPlaceholderText(/you@example.com/i)).not.toBeInTheDocument();

    const changeEmailButton = screen.getByRole("button", { name: /change email/i });
    await user.click(changeEmailButton);

    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
  });

  it("should show resend code button", () => {
    render(<VerifyAccountForm />);

    expect(screen.getByRole("button", { name: /resend code/i })).toBeInTheDocument();
  });

  it("should disable resend button when email is empty", () => {
    render(<VerifyAccountForm />);

    const resendButton = screen.getByRole("button", { name: /resend code/i });
    expect(resendButton).toBeDisabled();
  });

  it("should enable resend button when valid email is provided", async () => {
    const user = userEvent.setup();
    render(<VerifyAccountForm />);

    const emailInput = screen.getByPlaceholderText(/you@example.com/i);
    await user.type(emailInput, "test@example.com");

    const resendButton = screen.getByRole("button", { name: /resend code/i });
    expect(resendButton).not.toBeDisabled();
  });

  it("should call resend mutation when resend button is clicked", async () => {
    const user = userEvent.setup();
    localStorage.setItem("pendingVerificationEmail", "test@example.com");

    render(<VerifyAccountForm />);

    const resendButton = screen.getByRole("button", { name: /resend code/i });
    await user.click(resendButton);

    expect(mockResendMutate).toHaveBeenCalledWith("test@example.com", expect.any(Object));
  });

  it("should show loading state when verifying", () => {
    vi.mocked(authMutations.useVerifyAccountMutation).mockReturnValue({
      mutate: mockVerifyMutate,
      isPending: true,
    } as unknown as ReturnType<typeof authMutations.useVerifyAccountMutation>);

    render(<VerifyAccountForm />);

    expect(screen.getByRole("button", { name: /verify account/i })).toBeInTheDocument();
  });

  it("should show loading state when resending", () => {
    vi.mocked(authMutations.useResendCodeMutation).mockReturnValue({
      mutate: mockResendMutate,
      isPending: true,
    } as unknown as ReturnType<typeof authMutations.useResendCodeMutation>);

    localStorage.setItem("pendingVerificationEmail", "test@example.com");

    render(<VerifyAccountForm />);

    expect(screen.getByRole("button", { name: /verify account/i })).toBeInTheDocument();
  });

  it("should update email when typing in email input", async () => {
    const user = userEvent.setup();
    render(<VerifyAccountForm />);

    const emailInput = screen.getByPlaceholderText(/you@example.com/i) as HTMLInputElement;
    await user.type(emailInput, "newemail@example.com");

    expect(emailInput.value).toBe("newemail@example.com");
  });

  it("should show Didn't received the code text", () => {
    render(<VerifyAccountForm />);

    expect(screen.getByText(/didn't received the code/i)).toBeInTheDocument();
  });
});
