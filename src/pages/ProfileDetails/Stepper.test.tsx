import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserDetailsStepper } from "./StepperParent";

describe("User DetailsStepper", () => {
  const setup = () => {
    render(<UserDetailsStepper />);
  };

  const completeFirstStep = async (
    user: ReturnType<typeof userEvent.setup>,
  ) => {
    const firstNameInput = await screen.findByLabelText("firstName");
    const lastNameInput = await screen.findByLabelText("lastName");
    const ageInput = await screen.findByLabelText("age");
    const submitButton = await screen.findByRole("button", {
      name: "Next",
    });
    await user.type(firstNameInput, "John");
    await user.type(lastNameInput, "Doe");
    await user.type(ageInput, "25");
    await user.click(submitButton);
  };

  const completeSecondStep = async (
    user: ReturnType<typeof userEvent.setup>,
  ) => {
    await completeFirstStep(user);
    const adressInput = await screen.findByLabelText("Address");
    const cityInput = await screen.findByLabelText("City");
    const submitButton = await screen.findByRole("button", {
      name: "Next",
    });
    await user.type(adressInput, "1234 Main St");
    await user.type(cityInput, "City");
    await user.click(submitButton);
  };
  const completeThirdStep = async (
    user: ReturnType<typeof userEvent.setup>,
  ) => {
    await completeSecondStep(user);
    const bankNameInput = await screen.findByLabelText("Bank Name");
    const accountNumberInput = await screen.findByLabelText("Account Number");
    const submitButton = await screen.findByRole("button", {
      name: "Next",
    });
    await user.type(bankNameInput, "Testowy bank");
    await user.type(accountNumberInput, "123456789");
    await user.click(submitButton);
  };

  const requiredErrorCases = [
    "First name is required",
    "Last name is required",
    "Age is required",
  ];

  it.each(requiredErrorCases)(
    "shows - %s error message",
    async (errorMessage) => {
      setup();
      const user = userEvent.setup();
      const submitButton = await screen.findByRole("button", {
        name: "Next",
      });

      await user.click(submitButton);
      const errorText = await screen.findByText(errorMessage);
      expect(errorText).toBeDefined();
    },
  );

  it.each`
    inputName      | inputValue        | expectedError
    ${"firstName"} | ${"a"}            | ${"First name must be at least 2 characters long"}
    ${"firstName"} | ${"a".repeat(30)} | ${"First name must be at most 15 characters long"}
    ${"lastName"}  | ${"a"}            | ${"Last name must be at least 2 characters long"}
    ${"lastName"}  | ${"a".repeat(30)} | ${"Last name must be at most 25 characters long"}
    ${"age"}       | ${"17"}           | ${"You must be at least 18 years old"}
    ${"age"}       | ${"101"}          | ${"You must be at most 100 years old"}
  `(
    "shows error message when $inputName is $inputValue",
    async ({ inputName, inputValue, expectedError }) => {
      setup();
      const user = userEvent.setup();
      const input = await screen.findByLabelText(inputName);
      const submitButton = await screen.findByRole("button", {
        name: "Next",
      });
      await user.type(input, inputValue);
      await user.click(submitButton);

      const errorMessage = await screen.findByText(expectedError);
      expect(errorMessage).toBeDefined();
    },
  );

  it.each`
    inputName    | inputValue | expectedError
    ${"Address"} | ${""}      | ${"Address is required"}
    ${"City"}    | ${""}      | ${"City is required"}
  `(
    "shows error message when $inputName is $inputValue",
    async ({ expectedError }) => {
      setup();
      const user = userEvent.setup();

      await completeFirstStep(user);

      const submitButton = await screen.findByRole("button", {
        name: "Next",
      });
      await user.click(submitButton);
      const errorMessage = await screen.findByText(expectedError);
      expect(errorMessage).toBeDefined();
    },
  );
  it.each`
    inputName          | inputValue | expectedError
    ${"BankName"}      | ${""}      | ${"Bank Name is required"}
    ${"AccountNumber"} | ${""}      | ${"Account Number is required"}
  `(
    "shows error message when $inputName is $inputValue",
    async ({ expectedError }) => {
      setup();
      const user = userEvent.setup();

      await completeSecondStep(user);

      const submitButton = await screen.findByRole("button", {
        name: "Next",
      });
      await user.click(submitButton);
      const errorMessage = await screen.findByText(expectedError);
      expect(errorMessage).toBeDefined();
    },
  );
  it("renders summary component when all steps are completed", async () => {
    setup();
    const user = userEvent.setup();

    await completeThirdStep(user);

    const successMessage = await screen.findByRole("heading", {
      name: "Summary",
    });
    expect(successMessage).toBeDefined();
  });
});
