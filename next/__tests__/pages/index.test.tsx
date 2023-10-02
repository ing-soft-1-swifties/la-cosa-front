import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { renderWithProviders } from "@/src/utils/test-utils";
import Index from "@/src/pages/index";

describe("Page Index", () => {
  it("renders", () => {
    renderWithProviders(<Index />);
  });
  it("show text", () => {
    renderWithProviders(<Index />);
    screen.getByText("Welcome to La Cosa");
  });
});
