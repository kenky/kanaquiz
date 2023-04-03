import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../../components/App/App";
test("test", () => {
  render(<App />);
  expect(true).toBe(true);
});
