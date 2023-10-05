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

describe("Page HOME", () => {
  it("has things", () => {
    // Base Lobby Router
    mockRouter.push("/");
    renderWithProviders(<Home />, {});

    // Todo el form que luego sera testeado en si
    const titulo = screen.getByTestId("titulo");
    expect(titulo).toHaveTextContent("LA COSA");

    // Todo el form que luego sera testeado en si
    const startButton = screen.getByTestId("form-join-lobby");
    expect(startButton);

    // Boton de Crear partida
    const createButton = screen.getByTestId("create-game-btn");
    expect(createButton).toHaveTextContent("Crear Partida");
    act(() => {
      createButton.click();
    });
    const modaleCreate = screen.getByTestId("modal-crear");
    expect(mockRouter.pathname);
  });
});
