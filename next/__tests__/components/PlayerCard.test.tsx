import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { renderWithProviders } from "@/src/utils/test-utils";
import PlayerCard from "@/components/PlayerCard";


describe("Component Player Card", () => {
  it("has name", () => {
    const name = "CrazyMonkey"
    renderWithProviders(<PlayerCard name={name}/>);
    screen.getByText(name)

  });
});
