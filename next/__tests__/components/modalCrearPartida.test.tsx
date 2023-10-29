import { screen } from "@testing-library/react";
import ModalPP from "@/src/components/modalCrearPartida";
import "@testing-library/jest-dom";
import { renderWithProviders } from "@/src/utils/test-utils";
import { RootState } from "store/store";
import { PreloadedState } from "@reduxjs/toolkit";
import { GameStatus } from "@/store/gameSlice";
import mockRouter from "next-router-mock";
import { act } from "react-dom/test-utils";
import ModalCrearPartida from "@/src/components/modalCrearPartida";
import { Box, useDisclosure } from "@chakra-ui/react";

import { setupServer } from "msw/node";
import { GetGamesQueryResult } from "store/gameApi";
import { rest } from "msw";

// Mock Next Router for all tests.
jest.mock("next/router", () => jest.requireActual("next-router-mock"));

const RenderModal = () => {
  const disclosure = useDisclosure();
  return (
    <Box>
      <ModalCrearPartida
        disclouse={{ ...disclosure, isOpen: true }}
      ></ModalCrearPartida>
    </Box>
  );
};

describe("Component Modal Crear Partida", () => {
  const server = setupServer();

  beforeAll(() => {
    server.listen(); // Levantamos el server.
  });

  beforeEach(() => {
    server.resetHandlers(); // Limpiamos los handlers.
  });

  afterAll(() => {
    server.close(); // Cerramos el server.
  });

  it("renders", () => {
    renderWithProviders(<RenderModal />);
  });

  it("has inputs", async () => {
    // Base Lobby Router
    mockRouter.replace("/"); // Mock Router
    await act(async () => {
      renderWithProviders(<RenderModal></RenderModal>); // Renderizamos el componente.
    });

    //me fijo que el modal este abierto
    screen.getByTestId("modal-crear");

    //me fijo que el nombre del modal sea Partida
    screen.getByText("Partida");

    // Input nombre de la partida
    screen.getByTestId("modal-crear_nombrePartidaInput");

    // Input nombre del jugador
    screen.getByTestId("modal-crear_nombreJugadorInput");

    //me fijo que este el minimo de jugadores
    screen.getByTestId("modal-crear_minPlayersInput");

    //me fijo que este el maximo de jugadores
    screen.getByTestId("modal-crearmaxPlayersInput");

    // Boton de Crear Partida
    const startButton = screen.getByTestId("modal-crear_submit");
    //me fijo que el boton este habilitado
    expect(startButton).toBeEnabled();
  });

  // it("creates lobby", (done) => {
  //   //mockeo la peticion fetch
  //   server.use(
  //     rest.post("http://localhost:8000/create", async (req, res, ctx) => {
  //       return res(ctx.status(200), ctx.json({ token: "token" }));
  //     })
  //   );

  //   //rellenar los inputs del formulario
  //   const nombrePartida = screen.getByTestId("nombrePartida");
  //   const nombreJugador = screen.getByTestId("nombreJugador");
  //   const minPlayers = screen.getByTestId("minPlayers");
  //   const maxPlayers = screen.getByTestId("maxPlayers");
  //   const submitButton = screen.getByText("Crear Partida");

  //   act(() => {
  //     submitButton.click();
  //     //simulo navegacion a "/lobby"
  //     mockRouter.push("/lobby");
  //   });

  //   // checkeo
  //   expect(mockRouter.pathname).toBe("/lobby");
  // });
});
