import { test, expect } from "@playwright/test";

test.describe("Login Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("should display login form", async ({ page }) => {
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("should show validation errors for empty login form", async ({ page }) => {
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page.getByText("Your email is required.")).toBeVisible();
    await expect(page.getByText("The password is required.")).toBeVisible();
  });

  test("should show error for short password", async ({ page }) => {
    await page.locator("#email").fill("test@example.com");
    await page.locator("#password").fill("short");
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page.getByText("The password must contain at least 8 characters.")).toBeVisible();
  });

  test("should toggle password visibility", async ({ page }) => {
    const passwordInput = page.locator("#password");
    const toggleButton = page.locator("#password ~ button[type='button']");

    await expect(passwordInput).toHaveAttribute("type", "password");

    await toggleButton.click();

    await expect(passwordInput).toHaveAttribute("type", "text");

    await toggleButton.click();

    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("should navigate to register page", async ({ page }) => {
    await page.getByRole("link", { name: /create one/i }).click();

    await expect(page).toHaveURL(/.*register/);
  });

  test("should navigate to forgot password page", async ({ page }) => {
    await page.getByRole("link", { name: /forgot password/i }).click();

    await expect(page).toHaveURL(/.*forgot-password/);
  });

  test("should attempt login with valid credentials", async ({ page }) => {
    await page.route("**/auth/login", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "Login successful" }),
      });
    });

    await page.locator("#email").fill("test@example.com");
    await page.locator("#password").fill("password123");
    await page.getByRole("button", { name: /sign in/i }).click();

    await page.waitForURL("/");
  });

  test("should display error message on failed login", async ({ page }) => {
    await page.route("**/auth/login", (route) => {
      route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ error: "Invalid credentials" }),
      });
    });

    await page.locator("#email").fill("wrong@example.com");
    await page.locator("#password").fill("wrongpassword123");
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
  });
});

test.describe("Registration Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/register");
  });

  test("should display registration form", async ({ page }) => {
    await expect(page.locator("#name")).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.getByText(/i am a/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /buyer/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /seller/i })).toBeVisible();
  });

  test("should show validation errors for empty fields", async ({ page }) => {
    await page.getByRole("button", { name: /buyer/i }).click();
    await page.getByRole("button", { name: /create account/i }).click();

    await expect(page.getByText("Your name is required.")).toBeVisible();
    await expect(page.getByText("Your email is required.")).toBeVisible();
    await expect(page.getByText("The password is required.")).toBeVisible();
  });

  test("should disable submit button when no role is selected", async ({ page }) => {
    const submitButton = page.getByRole("button", { name: /create account/i });
    await expect(submitButton).toBeDisabled();
  });

  test("should enable submit button when role is selected", async ({ page }) => {
    await page.getByRole("button", { name: /buyer/i }).click();

    const submitButton = page.getByRole("button", { name: /create account/i });
    await expect(submitButton).not.toBeDisabled();
  });

  test("should select buyer role", async ({ page }) => {
    const buyerButton = page.getByRole("button", { name: /buyer/i });
    await buyerButton.click();

    await expect(buyerButton).toHaveClass(/bg-neutral-700/);
  });

  test("should select seller role", async ({ page }) => {
    const sellerButton = page.getByRole("button", { name: /seller/i });
    await sellerButton.click();

    await expect(sellerButton).toHaveClass(/bg-neutral-700/);
  });

  test("should toggle password visibility", async ({ page }) => {
    const passwordInput = page.locator("#password");
    const toggleButton = page.locator("#password ~ button[type='button']");

    await expect(passwordInput).toHaveAttribute("type", "password");

    await toggleButton.click();

    await expect(passwordInput).toHaveAttribute("type", "text");
  });

  test("should successfully register and redirect to verify account", async ({ page }) => {
    await page.route("**/auth/register", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify("Registration successful"),
      });
    });

    await page.locator("#name").fill("John Doe");
    await page.locator("#email").fill("john@example.com");
    await page.locator("#password").fill("password123");
    await page.getByRole("button", { name: /buyer/i }).click();
    await page.getByRole("button", { name: /create account/i }).click();

    await page.waitForURL("/verify-account");
  });

  test("should navigate back to login", async ({ page }) => {
    await page.getByRole("link", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/.*login/);
  });
});

test.describe("Verify Account Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/verify-account");
  });

  test("should display OTP input container", async ({ page }) => {
    const otpContainer = page.locator("[data-input-otp]");
    await expect(otpContainer).toBeVisible();
    const otpSlots = page.locator("[data-slot='input-otp-slot']");
    await expect(otpSlots).toHaveCount(6);
  });

  test("should display verify account button", async ({ page }) => {
    await expect(page.getByRole("button", { name: /verify account/i })).toBeVisible();
  });

  test("should display resend code button", async ({ page }) => {
    await expect(page.getByRole("button", { name: /resend code/i })).toBeVisible();
  });

  test("should show email input when no pending email", async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.goto("/verify-account", { waitUntil: "networkidle" });

    await expect(page.locator("#email")).toBeVisible();
  });

  test("should disable verify button initially", async ({ page }) => {
    const verifyButton = page.getByRole("button", { name: /verify account/i });
    await expect(verifyButton).toBeDisabled();
  });

  test("should successfully verify account and redirect to login", async ({ page }) => {
    await page.route("**/auth/verify-account", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify("Account verified"),
      });
    });

    await page.evaluate(() => {
      localStorage.setItem("pendingVerificationEmail", "test@example.com");
    });
    await page.reload();

    const otpContainer = page.locator("[data-input-otp]");
    await otpContainer.pressSequentially("123456");

    await page.getByRole("button", { name: /verify account/i }).click();

    await page.waitForURL("/login");
  });
});

test.describe("Forgot Password Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/forgot-password");
  });

  test("should display forgot password form", async ({ page }) => {
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.getByRole("button", { name: /send reset link/i })).toBeVisible();
  });

  test("should show validation error for empty email", async ({ page }) => {
    await page.getByRole("button", { name: /send reset link/i }).click();

    await expect(page.getByText("Your email is required.")).toBeVisible();
  });

  test("should navigate back to login", async ({ page }) => {
    await page.getByRole("link", { name: /back to sign in/i }).click();

    await expect(page).toHaveURL(/.*login/);
  });

  test("should successfully send reset link and show success message", async ({ page }) => {
    await page.route("**/auth/forgot-password", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify("Reset link sent"),
      });
    });

    await page.locator("#email").fill("test@example.com");
    await page.getByRole("button", { name: /send reset link/i }).click();

    await expect(page.getByText(/we've sent an email to/i)).toBeVisible();
    await expect(page.getByText("test@example.com")).toBeVisible();
  });

  test("should show try again button after success", async ({ page }) => {
    await page.route("**/auth/forgot-password", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify("Reset link sent"),
      });
    });

    await page.locator("#email").fill("test@example.com");
    await page.getByRole("button", { name: /send reset link/i }).click();

    await expect(page.getByRole("button", { name: /try again/i })).toBeVisible();
  });

  test("should return to form when try again is clicked", async ({ page }) => {
    await page.route("**/auth/forgot-password", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify("Reset link sent"),
      });
    });

    await page.locator("#email").fill("test@example.com");
    await page.getByRole("button", { name: /send reset link/i }).click();

    await page.getByRole("button", { name: /try again/i }).click();

    await expect(page.locator("#email")).toBeVisible();
    await expect(page.getByRole("button", { name: /send reset link/i })).toBeVisible();
  });
});

test.describe("Reset Password Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/auth/reset-password/test-token", (route) => {
      if (route.request().method() === "GET") {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ valid: true }),
        });
      } else {
        route.continue();
      }
    });
    await page.goto("/reset-password/test-token");
  });

  test("should display reset password form", async ({ page }) => {
    await expect(page.locator("#newPassword")).toBeVisible();
    await expect(page.locator("#confirmPassword")).toBeVisible();
    await expect(page.getByRole("button", { name: /reset password/i })).toBeVisible();
  });

  test("should show validation errors for empty fields", async ({ page }) => {
    await page.getByRole("button", { name: /reset password/i }).click();

    await expect(page.getByText("The password is required.").first()).toBeVisible();
  });

  test("should show error for short password", async ({ page }) => {
    await page.locator("#newPassword").fill("short");
    await page.locator("#confirmPassword").fill("short");
    await page.getByRole("button", { name: /reset password/i }).click();

    await expect(page.getByText("The password must contain at least 8 characters.")).toBeVisible();
  });

  test("should show error when passwords do not match", async ({ page }) => {
    await page.locator("#newPassword").fill("password123");
    await page.locator("#confirmPassword").fill("password456");
    await page.getByRole("button", { name: /reset password/i }).click();

    await expect(page.getByText("Passwords do not match")).toBeVisible();
  });

  test("should toggle password visibility for both fields", async ({ page }) => {
    const newPasswordInput = page.locator("#newPassword");
    const confirmPasswordInput = page.locator("#confirmPassword");
    const toggleButton = page.locator("#newPassword ~ button[type='button']");

    await expect(newPasswordInput).toHaveAttribute("type", "password");
    await expect(confirmPasswordInput).toHaveAttribute("type", "password");

    await toggleButton.click();

    await expect(newPasswordInput).toHaveAttribute("type", "text");
    await expect(confirmPasswordInput).toHaveAttribute("type", "text");
  });

  test("should successfully reset password and redirect to login", async ({ page }) => {
    await page.route("**/auth/reset-password/test-token", (route) => {
      if (route.request().method() === "POST") {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify("Password reset successful"),
        });
      } else if (route.request().method() === "GET") {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ valid: true }),
        });
      } else {
        route.continue();
      }
    });

    await page.locator("#newPassword").fill("newpassword123");
    await page.locator("#confirmPassword").fill("newpassword123");
    await page.getByRole("button", { name: /reset password/i }).click();

    await page.waitForURL("/login");
  });

  test("should disable submit button when passwords do not match", async ({ page }) => {
    await page.locator("#newPassword").fill("password123");
    await page.locator("#confirmPassword").fill("password456");

    await page.locator("#confirmPassword").blur();
    await page.getByRole("button", { name: /reset password/i }).click();

    await expect(page.getByRole("button", { name: /reset password/i })).toBeDisabled();
  });
});
