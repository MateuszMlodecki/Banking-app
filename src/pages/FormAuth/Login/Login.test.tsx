import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Login } from "./Login";

describe("Login page", () => {
  const setup = () => {
    render(<Login />);
  };

  it("renders component", async () => {
    setup();

    const text = await screen.findByText(
      "Please provide your details to authenticate"
    );
    expect(text).toBeDefined();
  });

  it("renders email and password fields", async () => {
    setup();
    const emailInput = await screen.findByLabelText("Email");
    const passwordInput = await screen.findByLabelText("Password");
    expect(emailInput).toBeDefined();
    expect(passwordInput).toBeDefined();
  });

  it("show error message on invalid email", async () => {
    setup();
    const user = userEvent.setup();

    const emailInput = await screen.findByLabelText("Email");
    const passwordInput = await screen.findByLabelText("Password");
    const submitButton = await screen.findByRole("button", { name: "Login" });

    await user.type(emailInput, "invaild-email");
    await user.type(passwordInput, "validPassword123");
    await user.click(submitButton);

    const errorMessage = await screen.findByText("Please provide valid email");
    expect(errorMessage).toBeDefined();
  });

  it("show error message when email field is empty", async () => {
    setup();
    const user = userEvent.setup();

    const passwordInput = await screen.findByLabelText("Password");
    const submitButton = await screen.findByRole("button", { name: "Login" });

    await user.type(passwordInput, "validPassword123");
    await user.click(submitButton);

    const errorMessage = await screen.findByText("Email is required");
    expect(errorMessage).toBeDefined();
  });

  it("show error message when password field is empty", async () => {
    setup();
    const user = userEvent.setup();

    const emailInput = await screen.findByLabelText("Email");
    const submitButton = await screen.findByRole("button", { name: "Login" });

    await user.type(emailInput, "dupa@gmail.com");
    await user.click(submitButton);

    const errorMessage = await screen.findByText(
      "You must provide your password"
    );
    expect(errorMessage).toBeDefined();
  });
});
