import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
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
    // const text = screen.getByText("login") => to nie jest asynchroniczne
    // const text = screen.queryByText("Login") => uzywamy go do szukania wartosci KTORYCH NIE CHCEMY zeby byly
    expect(text);
  });
});
