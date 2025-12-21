import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@/test/utils";
import RegisterForm from "@/components/forms/auth/RegisterForm";
import * as authMutations from "@/hooks/mutations/useAuthMutations";

vi.mock("@/hooks/mutations/useAuthMutations");
vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual("@tanstack/react-router");
  return {
    ...actual,
    Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
      <a href={to}>{children}</a>
    ),
    useRouter: () => ({
      navigate: vi.fn(),
    }),
  };
});

describe("RegisterForm", () => {
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authMutations.useRegisterMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as unknown as ReturnType<typeof authMutations.useRegisterMutation>);
  });

  it("should render register form fields", () => {
    render(<RegisterForm />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/i am a/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  it("should render buyer and seller role buttons", () => {
    render(<RegisterForm />);

    expect(screen.getByRole("button", { name: /buyer/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /seller/i })).toBeInTheDocument();
  });

  it("should toggle password visibility", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toHaveAttribute("type", "password");

    const toggleButtons = screen.getAllByRole("button", { name: "" });
    const toggleButton = toggleButtons[toggleButtons.length - 1];
    await user.click(toggleButton);

    expect(passwordInput).toHaveAttribute("type", "text");
  });

  it("should display validation errors for empty fields", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const buyerButton = screen.getByRole("button", { name: /buyer/i });
    await user.click(buyerButton);

    const submitButton = screen.getByRole("button", { name: /create account/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Your name is required.")).toBeInTheDocument();
      expect(screen.getByText("Your email is required.")).toBeInTheDocument();
      expect(screen.getByText("The password is required.")).toBeInTheDocument();
    });
  });

  it("should display validation error for short password", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "short");

    const buyerButton = screen.getByRole("button", { name: /buyer/i });
    await user.click(buyerButton);

    const submitButton = screen.getByRole("button", { name: /create account/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("The password must contain at least 8 characters.")).toBeInTheDocument();
    });
  });

  it("should select buyer role when buyer button is clicked", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const buyerButton = screen.getByRole("button", { name: /buyer/i });
    await user.click(buyerButton);

    expect(buyerButton).toHaveClass(/bg-neutral-700/);
  });

  it("should select seller role when seller button is clicked", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const sellerButton = screen.getByRole("button", { name: /seller/i });
    await user.click(sellerButton);

    expect(sellerButton).toHaveClass(/bg-neutral-700/);
  });

  it("should disable submit button when no role is selected", () => {
    render(<RegisterForm />);

    const submitButton = screen.getByRole("button", { name: /create account/i });
    expect(submitButton).toBeDisabled();
  });

  it("should enable submit button when role is selected", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const submitButton = screen.getByRole("button", { name: /create account/i });
    expect(submitButton).toBeDisabled();

    const buyerButton = screen.getByRole("button", { name: /buyer/i });
    await user.click(buyerButton);

    expect(submitButton).not.toBeDisabled();
  });

  it("should call register mutation with form data on valid submission", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");

    const buyerButton = screen.getByRole("button", { name: /buyer/i });
    await user.click(buyerButton);

    const submitButton = screen.getByRole("button", { name: /create account/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        {
          name: "John Doe",
          email: "test@example.com",
          password: "password123",
          role: "buyer",
        },
        expect.any(Object)
      );
    });
  });

  it("should show loading state when form is submitting", () => {
    vi.mocked(authMutations.useRegisterMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    } as unknown as ReturnType<typeof authMutations.useRegisterMutation>);

    render(<RegisterForm />);

    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  it("should have link to login page", () => {
    render(<RegisterForm />);

    expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute("href", "/login");
  });

  it("should switch between buyer and seller roles", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const buyerButton = screen.getByRole("button", { name: /buyer/i });
    const sellerButton = screen.getByRole("button", { name: /seller/i });

    await user.click(buyerButton);
    expect(buyerButton).toHaveClass(/bg-neutral-700/);

    await user.click(sellerButton);
    expect(sellerButton).toHaveClass(/bg-neutral-700/);
    expect(buyerButton).not.toHaveClass(/bg-neutral-700/);
  });
});
