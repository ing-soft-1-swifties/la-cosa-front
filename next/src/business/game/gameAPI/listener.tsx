import { Socket } from "socket.io-client";
import {
  GameState,
  setGameState,
  setLastPlayedCard,
  setCardsToShow,
  Card,
} from "@/store/gameSlice";
import { store } from "@/store/store";
import { beginGame, cancelGame, CancelGameReason } from "./manager";
import { StandaloneToast } from "@/src/pages/_app";
import { buildErrorToastOptions } from "@/src/utils/toasts";
import { setupChatListeners } from "../chat";
import GameCard, {
  CardTypes as GameCardEnum,
} from "@/components/layouts/game/GameCard";
import { setupNotificationsListeners } from "../notifications";

export enum EventType {
  ON_ROOM_NEW_PLAYER = "on_room_new_player",
  ON_ROOM_LEFT_PLAYER = "on_room_left_player",
  ON_ROOM_START_GAME = "on_room_start_game",
  ON_ROOM_CANCELLED_GAME = "on_room_cancelled_game",

  // Eventos de la partida:
  ON_GAME_PLAYER_TURN = "on_game_player_turn",
  ON_GAME_PLAYER_STEAL_CARD = "on_game_player_steal_card",
  ON_GAME_PLAYER_PLAY_CARD = "on_game_player_play_card",
  ON_GAME_PLAYER_PLAY_DEFENSE_CARD = "on_game_player_play_defense_card",
  ON_GAME_PLAYER_DISCARD_CARD = "on_game_player_discard_card",
  ON_GAME_BEGIN_EXCHANGE = "on_game_begin_exchange",
  ON_GAME_FINISH_EXCHANGE = "on_game_finish_exchange",
  ON_GAME_PLAYER_DEATH = "on_game_player_death",
  ON_GAME_END = "on_game_end",
  ON_GAME_INVALID_ACTION = "on_game_invalid_action",
}

export const setupGameSocketListeners = (gameSocket: Socket) => {
  gameSocket.onAny((ev, ...args) => {
    console.log(`${ev}`);
    console.log(args);
  });
  gameSocket.on(EventType.ON_ROOM_NEW_PLAYER, updateGameState);
  gameSocket.on(EventType.ON_ROOM_LEFT_PLAYER, updateGameState);
  gameSocket.on(EventType.ON_ROOM_START_GAME, updateGameState);
  gameSocket.on(EventType.ON_GAME_PLAYER_TURN, updateGameState);
  gameSocket.on(EventType.ON_GAME_PLAYER_STEAL_CARD, updateGameState);
  gameSocket.on(EventType.ON_GAME_PLAYER_PLAY_CARD, updateGameState);
  gameSocket.on(EventType.ON_GAME_PLAYER_PLAY_DEFENSE_CARD, updateGameState);
  gameSocket.on(EventType.ON_GAME_PLAYER_DISCARD_CARD, updateGameState);
  gameSocket.on(EventType.ON_GAME_BEGIN_EXCHANGE, updateGameState);
  gameSocket.on(EventType.ON_GAME_FINISH_EXCHANGE, updateGameState);
  gameSocket.on(EventType.ON_GAME_PLAYER_DEATH, updateGameState);

  gameSocket.on(EventType.ON_ROOM_CANCELLED_GAME, onRoomCancelledGame);
  gameSocket.on(EventType.ON_ROOM_START_GAME, onRoomStartGame);

  // TODO! Hay que ver si esto lo dejamos o es temporal
  gameSocket.on(EventType.ON_GAME_INVALID_ACTION, onGameInvalidAction);

  setupChatListeners(gameSocket);
  setupNotificationsListeners(gameSocket)

  gameSocket.on("disconnect", onGameSocketDisconnect);

  // Estados especificos:
  gameSocket.on(EventType.ON_GAME_PLAYER_PLAY_CARD, onGamePlayerPlayCard);
  gameSocket.on(
    EventType.ON_GAME_PLAYER_PLAY_DEFENSE_CARD,
    onGamePlayerPlayDefenseCard
  );
  gameSocket.on(EventType.ON_GAME_PLAYER_DISCARD_CARD, onGameDiscardCard);
};

type PlayCardPayload = {
  player_name: string;
  card_id: number;
  card_name: string;
  card_options: {
    target?: string;
  };
  effects?: {
    player: string;
    cards: Card[];
  };
};
function onGamePlayerPlayCard(payload: PlayCardPayload) {
  // Mostramos la ultima carta jugada:
  store.dispatch(
    setLastPlayedCard({
      player_name: payload.player_name,
      card_id: payload.card_id,
      card_name: payload.card_name,
    })
  );

  // Dependiendo de la carta jugada actualizamos el estado correspondiente:
  if (payload.effects != null) {
    const card = payload.card_name;
    const player = payload.effects.player;
    let title = "";
    if (
      player != store.getState().user.name &&
      (card == GameCardEnum.WHISKEY ||
        card == GameCardEnum.ANALYSIS ||
        card == GameCardEnum.SUSPICION)
    ) {
      if (card == GameCardEnum.WHISKEY)
        title = `${player} jugo una carta de Whisky:`;
      if (card == GameCardEnum.ANALYSIS)
        title = `Resultados del Analisis de ${player}:`;
      if (card == GameCardEnum.SUSPICION)
        title = `Carta aleatoria de ${player}:`;
      store.dispatch(
        setCardsToShow({
          cardsToShow: payload.effects.cards,
          player,
          title,
        })
      );
    }
  }
}

type PlayDefenseCardPayload = PlayCardPayload;
function onGamePlayerPlayDefenseCard(payload: PlayDefenseCardPayload) {
  store.dispatch(
    setLastPlayedCard({
      player_name: payload.player_name,
      card_id: payload.card_id,
      card_name: payload.card_name,
    })
  );
}

function onGameDiscardCard() {
  store.dispatch(setLastPlayedCard(undefined));
}

export type GameStateData = {
  gameState: GameState;
};

function calculateNewGameState(data: GameStateData) {
  const newState: any = {
    config: data.gameState.config,
    players: data.gameState.players.map((player) => ({
      id: player.id,
      name: player.name,
      position: player.position,
      status: player.status,
      on_turn: player.on_turn,
      on_exchange: player.on_exchange,
      quarantine: player.quarantine
    })),
    status: data.gameState.status,
    player_in_turn: data.gameState.player_in_turn,
    direction: data.gameState.direction,
  };
  if (data.gameState.playerData != null) {
    newState.playerData = {
      cards: data.gameState.playerData.cards,
      playerID: data.gameState.playerData.playerID,
      role: data.gameState.playerData.role,
      state: data.gameState.playerData!.state,
    };
  }
  return newState;
}

const updateGameState = (data: GameStateData) => {
  store.dispatch(setGameState(calculateNewGameState(data)));
};

function onRoomStartGame() {
  beginGame();
}

const onRoomCancelledGame = () => {
  cancelGame(CancelGameReason.CANCELED_BY_HOST);
};

type InvalidActionData = {
  title: string;
  message: string;
};
const onGameInvalidAction = (data: InvalidActionData) => {
  StandaloneToast(
    buildErrorToastOptions({
      title: data.title,
      description: data.message,
    })
  );
};

enum SocketDisconnectReason {
  SERVER_IO_DISCONNECT = "io server disconnect",
  CLIENT_IO_DISCONNECT = "io client disconnect",
  SERVER_SHUTTING_DOWN = "server shutting down",
  PING_TIMEOUT = "ping timeout",
  TRANSPORT_CLOSE = "transport close",
  TRANSPORT_ERROR = "transport error",
  PARSE_ERROR = "parse error",
  FORCED_CLOSE = "forced close",
  FORCED_SERVER_CLOSE = "forced server close",
}

const onGameSocketDisconnect = (reason: SocketDisconnectReason) => {
  if (
    reason == SocketDisconnectReason.CLIENT_IO_DISCONNECT ||
    reason == SocketDisconnectReason.SERVER_IO_DISCONNECT
  )
    return;
  else {
    cancelGame(CancelGameReason.DISCONNECTION);
  }
};
