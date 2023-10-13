import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { renderWithProviders } from "@/src/utils/test-utils";
import { RootState, setupStore, store } from "@/store/store";
import { PreloadedState } from "@reduxjs/toolkit";
import {
  CardSubTypes,
  CardTypes,
  GameStatus,
  PlayerRole,
  initialState,
  setGameState,
} from "@/store/gameSlice";
import { act } from "react-dom/test-utils";
import GameCard from "@/components/layouts/game/GameCard";

// Mock Next Router for all tests.
jest.mock("next/router", () => jest.requireActual("next-router-mock"));

const TEST_CONNECTION_TOKEN = "SuperSecretToken";

// Caracteristicas:
// -> El Usuario actual es el Host dentro de una partdia con jugadores
const PlayerInGameState: PreloadedState<RootState> = {
  game: {
    config: {
      id: -1,
      name: "",
      host: "",
      minPlayers: 4,
      maxPlayers: 12,
    },
    status: GameStatus.WAITING,
    players: [],
    playerData: {
      cards: [
        {
          id: 1,
          name: "Lanzallamas",
          type: CardTypes.AWAY,
          subType: CardSubTypes.ACTION,
        },
        {
          id: 2,
          name: "Infectado",
          type: CardTypes.AWAY,
          subType: CardSubTypes.ACTION,
        },
        {
          id: 3,
          name: "¡Nada de barbacoas!",
          type: CardTypes.AWAY,
          subType: CardSubTypes.ACTION,
        },
        {
          id: 4,
          name: "¡No, gracias!",
          type: CardTypes.AWAY,
          subType: CardSubTypes.ACTION,
        },
        {
          id: 5,
          name: "La cosa",
          type: CardTypes.AWAY,
          subType: CardSubTypes.ACTION,
        },
      ],
      cardSelected: 1,
      playerID: 1,
      role: PlayerRole.INFECTED,
    },
  },
  user: {
    gameConnToken: TEST_CONNECTION_TOKEN,
    name: "Pepito",
  },
};

describe("Page Game", () => {

    beforeEach(async () => {
    store.dispatch(setGameState(initialState));
  });

  it("renders", () => {
    renderWithProviders(<GameCard id={0} name="" />);
  });

  it("show card dont sheared", () => {
    renderWithProviders(<GameCard id={0} name="" />);
    screen.findByText("Carta indefinida");
  });

  it("has cards based on state", () => {
    var card = PlayerInGameState.game!.playerData.cards[0];
    renderWithProviders(<GameCard id={card.id} name={card.name} />, {
      preloadedState: PlayerInGameState,
    });
    const game = PlayerInGameState.game!;
    // Cards
    screen.getByTestId(`GAME_CARD_${card.id}`);
    screen.getByTestId(`GAME_CARD_IMG_${card.id}`);
  });

  it("click on card", () => {
    var card = PlayerInGameState.game!.playerData.cards[3];

    store.dispatch(setGameState(PlayerInGameState.game!));
    renderWithProviders(<GameCard id={card.id} name={card.name} />, {
      store,
    });

    const screenCard = screen.getByTestId(`GAME_CARD_${card.id}`);
    act(() => {
      screenCard.click();
    });
    expect(store.getState().game.playerData.cardSelected).toBe(card.id);
  });

  it("click on same card", () => {
    var card = PlayerInGameState.game!.playerData.cards[0];

    store.dispatch(setGameState(PlayerInGameState.game!));
    renderWithProviders(<GameCard id={card.id} name={card.name} />, {
      store,
    });

    const screenCard = screen.getByTestId(`GAME_CARD_${card.id}`);
    act(() => {
      screenCard.click();
    });
    expect(store.getState().game.playerData.cardSelected).toBe(undefined);
  });
});
