import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Register } from "./Register";

describe("Register page", () => {
  const setup = () => {
    render(<Register />);
  };

  it("renders component", async () => {
    setup();
    const text = await screen.findByText(
      "Please provide your details to register"
    );
    expect(text).toBeDefined();
  });

  it("renders Name, LastName, Age, Email, Password, RepeatPassword and City", async () => {
    setup();
    const nameInput = await screen.findByLabelText("Name");
    const lastNameInput = await screen.findByLabelText("LastName");
    const ageInput = await screen.findByLabelText("Age");
    const emailInput = await screen.findByLabelText("Email");
    const passwordInput = await screen.findByLabelText("Password");
    const repeatPasswordInput = await screen.findByLabelText("RepeatPassword");
    const cityInput = await screen.findByLabelText("City (Optional)");

    expect(nameInput).toBeDefined();
    expect(lastNameInput).toBeDefined();
    expect(ageInput).toBeDefined();
    expect(emailInput).toBeDefined();
    expect(passwordInput).toBeDefined();
    expect(repeatPasswordInput).toBeDefined();
    expect(cityInput).toBeDefined();
  });

  const requiredErrorCases = [
    "Name is required",
    "Lastname is required",
    "Email is required",
    "You must provide your password",
    "Please retype your password.",
  ];

  // https://jestjs.io/docs/api#testeachtablename-fn-timeout
  it.each(requiredErrorCases)(
    "show - %s error message",
    async (errorMessage) => {
      setup();
      const user = userEvent.setup();
      const submitButton = await screen.findByRole("button", {
        name: "sign in",
      });

      await user.click(submitButton);
      const errorText = await screen.findByText(errorMessage);
      expect(errorText);
    }
  );

  it("show error message's when every field is empty", async () => {
    setup();
    const user = userEvent.setup();
    const submitButton = await screen.findByRole("button", { name: "sign in" });

    await user.click(submitButton);

    const nameInputErrorMessage = await screen.findByText("Name is required");
    const lastNameInputErrorMessage = await screen.findByText(
      "Lastname is required"
    );
    //const ageInputErrorMessage = await screen.findByText("Age is required");
    const emailInputErrorMessage = await screen.findByText("Email is required");
    const passwordInputErrorMessage = await screen.findByText(
      "You must provide your password"
    );
    const repeatPasswordInputErrorMessage = await screen.findByText(
      "Please retype your password."
    );

    expect(nameInputErrorMessage).toBeDefined();
    expect(lastNameInputErrorMessage).toBeDefined();
    //expect(ageInputErrorMessage).toBeDefined();
    expect(emailInputErrorMessage).toBeDefined();
    expect(passwordInputErrorMessage).toBeDefined();
    expect(repeatPasswordInputErrorMessage).toBeDefined();
  });

  it.each`
    inputName     | inputedValue       | expectedError                                    | title
    ${"Name"}     | ${"A"}             | ${"Name must be at least 2 characters long"}     | ${"too short"}
    ${"Name"}     | ${"A".repeat(30)}  | ${"Name must be at most 15 characters long"}     | ${"too long"}
    ${"LastName"} | ${"A"}             | ${"Lastname must be at least 2 characters long"} | ${"too short"}
    ${"LastName"} | ${"A".repeat(30)}  | ${"Lastname must be at most 25 characters long"} | ${"too long"}
    ${"Age"}      | ${"17"}            | ${"You must be atleast 18 years old"}            | ${"too young"}
    ${"Email"}    | ${"invalid-email"} | ${"Please provide valid email"}                  | ${"invalid"}
  `(
    'show approbiate error message when $inputName is "$title"',
    async ({ inputName, inputedValue, expectedError }) => {
      setup();
      const user = userEvent.setup();
      const input = await screen.findByLabelText(inputName);
      const submitButton = await screen.findByRole("button", {
        name: "sign in",
      });

      await user.type(input, inputedValue);
      await user.click(submitButton);

      const errorMessage = await screen.findByText(expectedError);
      expect(errorMessage).toBeDefined();
    }
  );

  it("show error message's when Name and lastName is too short", async () => {
    setup();
    const user = userEvent.setup();
    const nameInput = await screen.findByLabelText("Name");
    const lastNameInput = await screen.findByLabelText("LastName");
    const submitButton = await screen.findByRole("button", { name: "sign in" });

    await user.type(nameInput, "A");
    await user.type(lastNameInput, "A");
    await user.click(submitButton);

    const nameInputErrorMessage = await screen.findByText(
      "Name must be at least 2 characters long"
    );
    const lastNameInputErrorMessage = await screen.findByText(
      "Lastname must be at least 2 characters long"
    );
    expect(nameInputErrorMessage).toBeDefined();
    expect(lastNameInputErrorMessage).toBeDefined();
  });

  it("show error message's when Name and lastName is too long", async () => {
    setup();
    const longWord = "A".repeat(30);

    const user = userEvent.setup();
    const nameInput = await screen.findByLabelText("Name");
    const lastNameInput = await screen.findByLabelText("LastName");
    const submitButton = await screen.findByRole("button", { name: "sign in" });

    await user.type(nameInput, longWord);
    await user.type(lastNameInput, longWord);
    await user.click(submitButton);

    const nameErrorMessage = await screen.findByText(
      "Name must be at most 15 characters long"
    );
    const lastNameInputErrorMessage = await screen.findByText(
      "Lastname must be at most 25 characters long"
    );
    expect(nameErrorMessage).toBeDefined();
    expect(lastNameInputErrorMessage).toBeDefined();
  });

  it("show error message when Age is less than 18", async () => {
    setup();
    const user = userEvent.setup();
    const ageInput = await screen.findByLabelText("Age");
    const submitButton = await screen.findByRole("button", { name: "sign in" });

    await user.type(ageInput, "16");
    await user.click(submitButton);

    const ageInputErrorMessage = await screen.findByText(
      "You must be atleast 18 years old"
    );

    expect(ageInputErrorMessage).toBeDefined();
  });

  it("show error message on invalid email", async () => {
    setup();
    const user = userEvent.setup();

    const emailInput = await screen.findByLabelText("Email");
    const submitButton = await screen.findByRole("button", { name: "sign in" });

    await user.type(emailInput, "invaild-email");
    await user.click(submitButton);

    const errorMessage = await screen.findByText("Please provide valid email");
    expect(errorMessage).toBeDefined();
  });

  it("show error message on non matching passwords", async () => {
    setup();
    const user = userEvent.setup();

    const passwordInput = await screen.findByLabelText("Password");
    const repeatPasswordInput = await screen.findByLabelText("RepeatPassword");
    const submitButton = await screen.findByRole("button", { name: "sign in" });

    await user.type(passwordInput, "Password");
    await user.type(repeatPasswordInput, "WrongPassword");

    await user.click(submitButton);

    const errorMessage = await screen.findByText("Your passwords do not match");

    expect(errorMessage).toBeDefined();
  });
  it("submit valid form succesfuly", async () => {
    setup();
    const user = userEvent.setup();

    const nameInput = await screen.findByLabelText("Name");
    const lastNameInput = await screen.findByLabelText("LastName");
    const ageInput = await screen.findByLabelText("Age");
    const emailInput = await screen.findByLabelText("Email");
    const passwordInput = await screen.findByLabelText("Password");
    const repeatPasswordInput = await screen.findByLabelText("RepeatPassword");
    const cityInput = await screen.findByLabelText("City (Optional)");
    const submitButton = await screen.findByRole("button", { name: "sign in" });

    await user.type(nameInput, "John");
    await user.type(lastNameInput, "Doe");
    await user.type(ageInput, "25");
    await user.type(emailInput, "john.doe@example.com");
    await user.type(passwordInput, "Password123!");
    await user.type(repeatPasswordInput, "Password123!");
    await user.type(cityInput, "Warsaw");
    await user.click(submitButton);

    const succesMessage = await screen.findByText("Registration succesful");
    expect(succesMessage).toBeDefined();
  });
});
