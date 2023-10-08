import { screen } from "@testing-library/react"; // React-testing-library
import "@testing-library/jest-dom";
import { renderWithProviders } from "@/src/utils/test-utils";
import GameList from "@/components/layouts/home/GameList";
import { act } from "react-dom/test-utils";
import { rest } from "msw";
import { GetGamesQueryResult } from "@/store/gameApi";

// Server para mockear requests:
import { setupServer } from "msw/node";
const server = setupServer();

describe("Component Game List", () => {
  beforeAll(() => {
    server.listen();
  });

  beforeEach(() => {
    server.resetHandlers();
  });
  
  afterAll(() => {
    server.close();
  });

  it("renders", async () => {
    await act(async () => {
      renderWithProviders(<GameList />);
    });
  });

  it("has title", async () => {
    await act(async () => {
      renderWithProviders(<GameList />);
    });
    screen.getByText("Partidas");
  });

  it("renders loading spinner", async () => {
    server.use(
      rest.get("http://localhost:8000/list", async (req, res, ctx) => {
        // Esperamos 200 ms
        await new Promise((res) => setTimeout(res, 200));
        return res(ctx.status(200));
      })
    );
    await act(async () => {
      renderWithProviders(<GameList />);
    });
    screen.getByTestId("game-list_spinner");
  });

  it("renders mocked games list", async () => {
    server.use(
      rest.get("http://localhost:8000/list", (req, res, ctx) => {
        const games: GetGamesQueryResult = [
          {
            id: 1,
            name: "La Partida de Pepe",
            max_players: 12,
            players_count: 5,
          },
        ];
        return res(ctx.status(200), ctx.json(games));
      })
    );

    await act(async () => {
      renderWithProviders(<GameList />);
    });

    expect(await screen.findByText("#1")).toBeInTheDocument();
    expect(await screen.findByText("La Partida de Pepe")).toBeInTheDocument();
    expect(await screen.findByText("5/12")).toBeInTheDocument();
  });
  
  it("renders request error", async () => {
    server.use(
      rest.get("http://localhost:8000/list", (req, res, ctx) => {
        return res(ctx.status(500), ctx.text("Internal Server Error."));
      })
    );
    await act(async () => {
      renderWithProviders(<GameList />);
    });
    expect(
      await screen.findByText("Error cargando la Lista de Partidas Disponibles")
    ).toBeInTheDocument();
  });
});
