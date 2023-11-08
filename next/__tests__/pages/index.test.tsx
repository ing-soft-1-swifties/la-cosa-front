import { screen } from "@testing-library/react";
import Home from "@/src/pages/index";
import "@testing-library/jest-dom";
import { renderWithProviders } from "@/src/utils/test-utils";
import { RootState } from "store/store";
import { PreloadedState } from "@reduxjs/toolkit";
import { GameStatus } from "@/store/gameSlice";
import mockRouter from "next-router-mock";
import { act } from "react-dom/test-utils";

// Mock Next Router for all tests.
jest.mock("next/router", () => jest.requireActual("next-router-mock"));

describe("Page index", () => {
  it("has things", async () => {
    // Base Lobby Router
    mockRouter.push("/");
    await act(async () => {
      renderWithProviders(<Home />, {});
    });

    // Todo el form que luego sera testeado en si
    const titulo = screen.getByTestId("home_titulo");
    expect(titulo).toHaveTextContent("LA COSA");

    // Todo el form que luego sera testeado en si
    screen.getByTestId("form-join-lobby");

    // Boton de Crear partida
    const createButton = screen.getByTestId("create-game-btn");
    expect(createButton).toHaveTextContent("Crear Partida");
    act(() => {
      createButton.click();
    });
    screen.getByTestId("modal-crear");
    expect(mockRouter.pathname).toBe("/");
  });

  it("renders games list", async () => {
    await act(async () => {
      renderWithProviders(<Home />, {});
    });

    // Test que apareza la lista de juegos. Luego se testea el component por su cuenta
    screen.getByTestId("game-list");
  });
});
