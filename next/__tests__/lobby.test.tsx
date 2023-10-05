import { screen } from "@testing-library/react";
import Lobby from "@/src/pages/lobby";
import "@testing-library/jest-dom";
import { renderWithProviders } from "@/src/utils/test-utils";
import { RootState } from "store/store";
import { PreloadedState } from "@reduxjs/toolkit";
import { GameStatus } from "@/store/gameSlice";

const GenericAppState: PreloadedState<RootState> = {
  game: {
    id: "1",
    status: GameStatus.WAITING,
    minPlayers: 12,
    maxPlayers: 12,
    host: "",
    players: [],
  },
};

describe("Lobby", () => {
  it("renders a heading", () => {
    const appState = GenericAppState;
    renderWithProviders(<Lobby />, {
      preloadedState: appState,
    });

    const game = appState.game!;
    screen.getByText("Jugadores");
    screen.getByText(`Lobby #${game.id}`);
    screen.getByText("Jugadores");
    screen.getByText("Jugadores");
    screen.getByText("Jugadores");
    // const heading = screen.getByRole("heading", {
    //   name: /welcome to next\.js!/i,
    // });
    // const heading = screen.findAllByText("Jugadores");

    // expect(heading).toBeInTheDocument();
  });
});
