import { Socket } from "socket.io-client";
import { gameSocket } from "../gameAPI";
import { store } from "@/store/store";
import {
  ChatMessage,
  ChatMessageType,
  addChatMessage,
  ChatMessageSeverity,
  Card,
  CardTypes,
} from "@/store/gameSlice";
import { EventType } from "../gameAPI/listener";
import { StandaloneToast } from "pages/_app";
import {
  buildInfoToastOptions,
  buildSucessToastOptions,
  buildWarningToastOptions,
} from "utils/toasts";

export function setupNotificationsListeners(gameSocket: Socket) {
  gameSocket.on(EventType.ON_GAME_PLAYER_TURN, onPlayerTurn);
  gameSocket.on(EventType.ON_GAME_PLAYER_PLAY_CARD, onPlayerPlayCard);
  gameSocket.on(EventType.ON_GAME_PLAYER_DISCARD_CARD, onPlayerDiscardCard);
  gameSocket.on(EventType.ON_GAME_PLAYER_DEATH, onPlayerDeath);
  gameSocket.on(EventType.ON_GAME_PLAYER_STEAL_CARD, onPlayerStealCard);
}

type PlayerDeathReasonEncoded = "LANZALLAMAS" | "SUPERINFECCION";
type OnPlayerDeathPayload = {
  player: string;
  reason: PlayerDeathReasonEncoded;
  killer?: string;
};
function onPlayerDeath(payload: OnPlayerDeathPayload) {
  const localPlayerName = store.getState().user.name;
  const isLocalPlayerDead = localPlayerName == payload.player;
  const reason = payload.reason;
  if (reason == "LANZALLAMAS" && payload.killer == null) {
    console.error("Missing killer value on Player Death.");
    return;
  }
  let message = "";
  if (isLocalPlayerDead) {
    // Generate Log Message
    if (reason == "LANZALLAMAS") message = `¡${payload.killer} te quemo vivo!`;
    else if (reason == "SUPERINFECCION")
      message =
        "¡Fuiste Superinfectado! Tenes demasiadas cartas de infeccion para intercambiar";

    // Send Toast message
    StandaloneToast(
      buildWarningToastOptions({
        title: "¡Moriste!",
        description: message,
        duration: 10000,
      })
    );
  } else {
    // Generate Log Message
    if (reason == "LANZALLAMAS")
      message = `¡El jugador ${payload.killer} rostizo vivo a ${payload.player}!`;
    else if (reason == "SUPERINFECCION")
      message = `¡El jugador ${payload.player} fue Superinfectado!`;

    // Send Toast Message
    StandaloneToast(
      buildWarningToastOptions({
        title: `¡El jugador ${payload.player} murio!`,
        description: message,
        duration: 10000,
      })
    );
  }
  store.dispatch(
    addChatMessage({
      type: ChatMessageType.GAME_MESSAGE,
      severity: ChatMessageSeverity.CRITICAL,
      message,
    })
  );
}

type OnPlayerTurnPayload = {
  player: string;
};
function onPlayerTurn(payload: OnPlayerTurnPayload) {
  const localPlayerName = store.getState().user.name;
  const player = store
    .getState()
    .game.players.find((player) => player.name == payload.player);

  const isLocalPlayer = localPlayerName == payload.player;
  if (player == null) {
    console.error("Unknown player in turn!");
    return;
  }

  let message = "";
  let severity = ChatMessageSeverity.NORMAL;
  if (isLocalPlayer) {
    message = "¡Es el comienzo de tu turno!";
    severity = ChatMessageSeverity.INFO;
    StandaloneToast(
      buildSucessToastOptions({
        description: message,
        position: "top-right",
        duration: 9000,
      })
    );
  } else {
    message = `Es el comienzo del turno de ${player.name}`;
    severity = ChatMessageSeverity.NORMAL;
  }
  store.dispatch(
    addChatMessage({
      type: ChatMessageType.GAME_MESSAGE,
      severity: severity,
      message,
    })
  );
}

type OnPlayerStealCardPayload = {
  player: string;
  cards?: Card[];
  card_type: CardTypes;
  quarantine:
    | [
        {
          player_name: string;
          card: Card;
        }
      ]
    | null;
};
function onPlayerStealCard(payload: OnPlayerStealCardPayload) {
  const localPlayerName = store.getState().user.name;
  const player = store
    .getState()
    .game.players.find((player) => player.name == payload.player);

  const isLocalPlayer = localPlayerName == payload.player;
  const cards = payload.cards;
  const quarantine_cards = payload.quarantine;

  if (player == null) {
    console.error("Unknown player stealing card!");
    return;
  }
  if (isLocalPlayer && cards == null) {
    console.error("Missing player cards!");
    return;
  }
  if (!isLocalPlayer && player.quarantine > 0 && quarantine_cards == null) {
    console.error("Missing player quarantine cards!");
    return;
  }

  let message = "";
  let severity = ChatMessageSeverity.INFO;
  if (isLocalPlayer) {
    const card = cards![0];
    message = `Robaste la carta: ${card.name}`;
    StandaloneToast(
      buildSucessToastOptions({
        position: "top-right",
        description: message,
        duration: 9000,
      })
    );
  } else {
    if (player.quarantine > 0) {
      const card = quarantine_cards![0].card;
      message = `El jugador en cuarentena ${player.name} robo la carta ${
        card.name
      } de tipo ${card.type == CardTypes.AWAY ? "¡Alejate!" : "¡Panico!"}`;
      severity = ChatMessageSeverity.WARNING;
      StandaloneToast(
        buildWarningToastOptions({
          position: "top-right",
          description: message,
          duration: 9000,
        })
      );
    } else {
      message = `El jugador ${player.name} robo una carta ${
        payload.card_type == CardTypes.AWAY ? "¡Alejate!" : "¡Panico!"
      }`;
      severity = ChatMessageSeverity.NORMAL;
      StandaloneToast(
        buildInfoToastOptions({
          position: "top-right",
          description: message,
          duration: 9000,
        })
      );
    }
  }
  store.dispatch(
    addChatMessage({
      type: ChatMessageType.GAME_MESSAGE,
      severity: severity,
      message,
    })
  );
}

type OnPlayerPlayCardPayload = {
  player_name: string;
  card_name: string;
  card_options: {
    target?: number;
  };
};
function onPlayerPlayCard(payload: OnPlayerPlayCardPayload) {
  const localPlayerName = store.getState().user.name;
  const player = store
    .getState()
    .game.players.find((player) => player.name == payload.player_name);
  const isLocalPlayer = localPlayerName == payload.player_name;
  if (player == null) {
    console.error("Unknown player playing card!");
    return;
  }
  if (!isLocalPlayer) {
    let message = "";
    let severity = ChatMessageSeverity.NORMAL;
    const target = payload.card_options.target;
    if (target == null) {
      message = `El jugador ${player.name} jugó la carta ${payload.card_name}`;
    } else {
      const target_name = store
        .getState()
        .game.players.find((player) => player.id == target)?.name;
      if (target_name == null) {
        console.error("Target name not found!");
        return;
      }
      if (target_name != localPlayerName) {
        message = `El jugador ${player.name} jugó la carta ${payload.card_name} al jugador ${target_name}`;
      } else {
        message = `El jugador ${player.name} jugó en tu contra la carta ${payload.card_name}`;
        severity = ChatMessageSeverity.WARNING;
      }
    }
    if (severity == ChatMessageSeverity.NORMAL)
      StandaloneToast(
        buildInfoToastOptions({
          description: message,
          duration: 6000,
        })
      );
    else if (severity == ChatMessageSeverity.WARNING)
      StandaloneToast(
        buildWarningToastOptions({
          title: "¡Cuidado!",
          description: message,
          duration: 9000,
        })
      );
    store.dispatch(
      addChatMessage({
        type: ChatMessageType.GAME_MESSAGE,
        severity: severity,
        message,
      })
    );
  }
}

type OnPlayerDiscardCardPayload = {
  player: string;
  quarantine:
    | [
        {
          player_name: string;
          card: Card;
        }
      ]
    | null;
};
function onPlayerDiscardCard(payload: OnPlayerDiscardCardPayload) {
  const localPlayerName = store.getState().user.name;
  const player = store
    .getState()
    .game.players.find((player) => player.name == payload.player);

  const isLocalPlayer = localPlayerName == payload.player;
  const quarantine_cards = payload.quarantine;
  if (player == null) {
    console.error("Unknown player discarding card!");
    return;
  }
  if (!isLocalPlayer && player.quarantine > 0 && quarantine_cards == null) {
    console.error("Missing player quarantine cards!");
    return;
  }

  let message = "";
  let severity = ChatMessageSeverity.NORMAL;
  if (!isLocalPlayer) {
    if (player.quarantine > 0) {
      const card = quarantine_cards![0].card;
      message = `El jugador en cuarentena ${player.name} descarto la carta ${
        card.name
      } de tipo ${card.type == CardTypes.AWAY ? "¡Alejate!" : "¡Panico!"}`;
      severity = ChatMessageSeverity.WARNING;
      StandaloneToast(
        buildWarningToastOptions({
          description: message,
          duration: 6000,
        })
      );
    } else {
      message = `El jugador ${player.name} descarto una carta`;
    }
  }
  store.dispatch(
    addChatMessage({
      type: ChatMessageType.GAME_MESSAGE,
      severity: severity,
      message,
    })
  );
}
