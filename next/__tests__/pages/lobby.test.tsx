import { screen } from "@testing-library/react";
import Lobby from "@/src/pages/lobby";
import "@testing-library/jest-dom";
import { renderWithProviders } from "@/src/utils/test-utils";
import { RootState } from "store/store";
import { PreloadedState } from "@reduxjs/toolkit";
import { GameStatus } from "@/store/gameSlice";
import mockRouter from "next-router-mock";
import { act } from "react-dom/test-utils";

// Mock Next Router for all tests.
jest.mock("next/router", () => jest.requireActual("next-router-mock"));

// Estado generico, caracteristicas:
// -> No es posible iniciar la partida por falta de jugadores
const GenericAppState: PreloadedState<RootState> = {
  game: {
    uuid: "1",
    config: {
      name: "La partida",
      host: "Pepito",
      minPlayers: 4,
      maxPlayers: 12,
    },
    status: GameStatus.WAITING,
    players: [
      {
        uuid: "CrazyMonkey",
        name: "CrazyMonkey",
      },
    ],
  },
  user: {
    gameConnToken: "",
    name: "Pepito",
  },
};

describe("Page Lobby", () => {
  it("has text based on state", () => {
    const appState = GenericAppState;

    // Base Lobby Router
    mockRouter.push("/lobby");
    renderWithProviders(<Lobby />, {
      preloadedState: appState,
    });

    const game = appState.game!;
    // UUID del Lobby
    screen.getByText(`Lobby ${game.uuid}`);
    // Nombre de la partida
    screen.getByText(`${game.config.name}`);
    // Titulo de la lista de Jugadores
    screen.getByText("Jugadores");
    // Host de la partida
    screen.getByText(`Host: ${game.config.host}`);
    // Minimo de Jugadores de la partida
    screen.getByText(`Minimo de Jugadores: ${game.config.minPlayers}`);
    // Maximo de Jugadores de la partida
    screen.getByText(`Maximo de Jugadores: ${game.config.maxPlayers}`);
    // Jugadores conectados en la partida
    screen.getByText(`Jugadores: ${game.players.length}`);
    // Boton de Iniciar Partida
    const startButton = screen.getByTestId("start-button");
    expect(startButton).toHaveTextContent("Iniciar Partida");

    // Como usamos el estado generico 
    // TODO!
    expect(startButton).toBeDisabled();
    // Boton de Salir del Lobby
    const leaveButton = screen.getByTestId("leave-button");
    expect(leaveButton).toHaveTextContent("Salir del Lobby");
    act(() => {
      leaveButton.click();
    });
    expect(mockRouter.pathname).toBe("/");
  });

  it("shows players cards", () => {
    const appState = GenericAppState;
    renderWithProviders(<Lobby />, {
      preloadedState: appState,
    });

    const game = appState.game!;
    game.players.forEach((player) => {
      screen.getByText(player.name);
    });
  });
});
