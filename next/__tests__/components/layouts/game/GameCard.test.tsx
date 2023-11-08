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
  PlayerStatus,
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
    players: [
      {
        id: 1,
        name: "Test",
        in_quarantine: false,
        status: PlayerStatus.ALIVE,
        position: 1,
      },
    ],
    playerData: {
      cards: [
        {
          id: 1,
          name: "Lanzallamas",
          type: CardTypes.AWAY,
          subType: CardSubTypes.ACTION,
          needTarget: false,
          targetAdjacentOnly: false
        },
        {
          id: 2,
          name: "Infectado",
          type: CardTypes.AWAY,
          subType: CardSubTypes.ACTION,
          needTarget: true,
          targetAdjacentOnly: false
        },
        {
          id: 3,
          name: "¡Nada de barbacoas!",
          type: CardTypes.AWAY,
          subType: CardSubTypes.ACTION,
          needTarget: true,
          targetAdjacentOnly: true
        },
        {
          id: 4,
          name: "¡No, gracias!",
          type: CardTypes.AWAY,
          subType: CardSubTypes.ACTION,
          needTarget: false,
          targetAdjacentOnly: false
        },
        {
          id: 5,
          name: "La cosa",
          type: CardTypes.AWAY,
          subType: CardSubTypes.ACTION,
          needTarget: false,
          targetAdjacentOnly: false
        },
        {
          id: 6,
          name: "Analisis",
          type: CardTypes.AWAY,
          subType: CardSubTypes.ACTION,
          needTarget: false,
          targetAdjacentOnly: false
        },
        {
          id:7,
          name:"Aqui estoy bien",
          type: CardTypes.AWAY,
          subType: CardSubTypes.DEFENSE,
          needTarget: false,
          targetAdjacentOnly: false
        },
        {
          id:8,
          name:"Aterrador",
          type: CardTypes.AWAY,
          subType: CardSubTypes.DEFENSE,
          needTarget: false,
          targetAdjacentOnly: false
        },
        {
          id:9,
          name: "¡Cambio de lugar!",
          type: CardTypes.AWAY,
          subType: CardSubTypes.ACTION,
          needTarget: false,
          targetAdjacentOnly: false
        },
        {
          id:10,
          name:"Cuarentena",
          type: CardTypes.AWAY,
          subType: CardSubTypes.OBSTACLE,
          needTarget: false,
          targetAdjacentOnly: false
        },
        {
          id:11,
          name:"Determinacion",
          type: CardTypes.AWAY,
          subType: CardSubTypes.ACTION,
          needTarget: false,
          targetAdjacentOnly: false
        },
        {
          id:12,
          name: "¡Fallaste!",
          type: CardTypes.AWAY,
          subType: CardSubTypes.DEFENSE,
          needTarget: false,
          targetAdjacentOnly: false
        },
        {
          id:13,
          name: "Hacha",
          type: CardTypes.AWAY,
          subType: CardSubTypes.ACTION,
          needTarget: false,
          targetAdjacentOnly: false
        },
        {
          id:14,
          name:"¡Mas Vale Que Corras!",
          type: CardTypes.AWAY,
          subType: CardSubTypes.ACTION,
          needTarget: false,
          targetAdjacentOnly: false
        },
        {
          id:15,
          name:"Puerta Atrancada",
          type: CardTypes.AWAY,
          subType: CardSubTypes.OBSTACLE,
          needTarget: false,
          targetAdjacentOnly: false
        },
        {
          id:16,
          name: "Seduccion",
          type: CardTypes.AWAY,
          subType: CardSubTypes.ACTION,
          needTarget: false,
          targetAdjacentOnly: false
        },
        {
          id:17,
          name:"Sospecha",
          type: CardTypes.AWAY,
          subType: CardSubTypes.ACTION,
          needTarget: false,
          targetAdjacentOnly: false
        },
        {
          id:18,
          name:"Vigila Tus Espaldas",
          type: CardTypes.AWAY,
          subType: CardSubTypes.ACTION,
          needTarget: false,
          targetAdjacentOnly: false
        },
        {
          id:19,
          name:"Whisky",
          type: CardTypes.AWAY,
          subType: CardSubTypes.ACTION,
          needTarget: false,
          targetAdjacentOnly: false
        },
      ],
      cardSelected: 1,
      playerSelected: 1,
      playerID: 1,
      role: PlayerRole.INFECTED,
    },
  },
  user: {
    gameConnToken: TEST_CONNECTION_TOKEN,
    name: "Pepito",
  },
};

describe("Component Game Card", () => {
  beforeEach(async () => {
    store.dispatch(setGameState(initialState));
  });

  it("renders", () => {
    renderWithProviders(<GameCard card_id={0} name="" />);
  });

  it("show card dont sheared", () => {
    renderWithProviders(<GameCard card_id={0} name="" />);
    screen.findByText("Carta indefinida");
  });

  it("has cards based on state", () => {
    const card = PlayerInGameState.game!.playerData!.cards[0];
    renderWithProviders(<GameCard card_id={card.id} name={card.name} />, {
      preloadedState: PlayerInGameState,
    });
    const game = PlayerInGameState.game!;
    // Cards
    screen.getByTestId(`GAME_CARD_${card.id}`);
    screen.getByTestId(`GAME_CARD_IMG_${card.id}`);
  });

  it("click on card", () => {
    var card = PlayerInGameState.game!.playerData!.cards[3];

    store.dispatch(setGameState(PlayerInGameState.game!));
    renderWithProviders(<GameCard card_id={card.id} name={card.name} />, {
      store,
    });

    const screenCard = screen.getByTestId(`GAME_CARD_${card.id}`);
    screenCard.click();
    expect(store.getState().game.playerData!.cardSelected).toBe(card.id);
  });

  it("click on same card", () => {
    var card = PlayerInGameState.game!.playerData!.cards[0];

    store.dispatch(setGameState(PlayerInGameState.game!));
    renderWithProviders(<GameCard card_id={card.id} name={card.name} />, {
      store,
    });

    const screenCard = screen.getByTestId(`GAME_CARD_${card.id}`);
    screenCard.click();
    expect(store.getState().game.playerData!.cardSelected).toBe(undefined);
  });
});
