import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { renderWithProviders } from "@/src/utils/test-utils";
import PlayerCard from "@/components/PlayerCard";
import { GamePlayer, PlayerStatus } from "@/store/gameSlice";

describe("Component Player Card", () => {
  it("has name", () => {
    const name = "CrazyMonkey";
    const player: GamePlayer = {name: name,
    id: 2,
    status: PlayerStatus.ALIVE,
    quarantine: 3,
    position: 2,
    on_turn: false,
    on_exchange: false};

    renderWithProviders(
      <PlayerCard player={player}  />
    );
    screen.getByText(name);
  });
});
