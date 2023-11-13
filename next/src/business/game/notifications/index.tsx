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
  gameSocket.on(EventType.ON_GAME_PLAYER_STEAL_CARD, onPlayerStealCard);
  gameSocket.on(EventType.ON_GAME_PLAYER_PLAY_CARD, onPlayerPlayCard);
  gameSocket.on(EventType.ON_GAME_PLAYER_DISCARD_CARD, onPlayerDiscardCard);
  gameSocket.on(EventType.ON_GAME_BEGIN_EXCHANGE, onBeginExchange);
  gameSocket.on(EventType.ON_GAME_FINISH_EXCHANGE, onFinishExchange);
  gameSocket.on(EventType.ON_GAME_PLAYER_DEATH, onPlayerDeath);
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
    | {
        player_name: string;
        card: Card;
      }[]
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
    | {
        player_name: string;
        card: Card;
      }[]
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

/*
 * ======================================
 *   NOTIFICACION INICIO DE INTERCAMBIO
 * ======================================
 */
type OnBeginExchangePayload = {
  players: [string, string];
};
function onBeginExchange(payload: OnBeginExchangePayload) {
  const localPlayerName = store.getState().user.name;
  const isExchanging =
    payload.players.find((player) => player == localPlayerName) != null;

  const [first_player, second_player] = payload.players;
  let message = "";
  let severity = ChatMessageSeverity.NORMAL;
  if (isExchanging) {
    const target =
      localPlayerName == first_player ? second_player : first_player;
    message = `Debes elegir una carta para intercambiar con el jugador ${target}!`;
    severity = ChatMessageSeverity.WARNING;
    StandaloneToast(
      buildWarningToastOptions({
        description: message,
        duration: 12000,
        position: "bottom",
      })
    );
  } else
    message = `Los jugadores ${first_player} y ${second_player} van a intercambiar cartas.`;
  store.dispatch(
    addChatMessage({
      type: ChatMessageType.GAME_MESSAGE,
      severity,
      message,
    })
  );
}

/*
 * ======================================
 *   NOTIFICACION FIN DE INTERCAMBIO
 * ======================================
 */
type OnFinishExchangePayload = {
  players: [string, string];
  quarantine:
    | {
        player_name: string;
        card: Card;
      }[]
    | null;
  card_in?: Card;
  card_out?: Card;
};
function onFinishExchange(payload: OnFinishExchangePayload) {
  const localPlayerName = store.getState().user.name;
  const isExchanging =
    payload.players.find((player) => player == localPlayerName) != null;
  const [first_player, second_player] = payload.players;
  let message = "";
  let severity = ChatMessageSeverity.NORMAL;
  if (isExchanging) {
    const other_player =
      localPlayerName == first_player ? second_player : first_player;
    message = `Finalizo tu intercambio con ${other_player}, recibiste la carta ${payload.card_in}`;
    severity = ChatMessageSeverity.INFO;
    StandaloneToast(
      buildSucessToastOptions({
        description: message,
        duration: 9000,
        position: "top",
      })
    );
    // TODO! REMOVER SI NO HACE FALTA:
    // if (payload.quarantine == null) {
    //   // CASO NINGUNO EN CUARENTENA
    //   const other_player =
    //     localPlayerName == first_player ? second_player : first_player;
    // } else {
    //   const exchange = payload.quarantine;
    //   const on_quarantine =
    //     payload.quarantine.find(
    //       (player) => player.player_name == localPlayerName
    //     ) != null;
    //   if (exchange.length == 1) {
    //     // CASO UNO EN CUARENTENA Y EL OTRO NO
    //     const quarantine_player = exchange[0];
    //     if (localPlayerName == quarantine_player.player_name) {
    //       // CASO ESTOY EN CUARENTENA
    //       const other_player =
    //         localPlayerName == first_player ? second_player : first_player;
    //       message = `Finalizo tu intercambio con el jugador ${other_player}, recibiste la carta ${payload.card_in}`;
    //     } else {
    //       // CASO NO ESTOY EN CUARENTENA
    //       const card = quarantine_player.card;
    //       const other_player = quarantine_player.player_name;
    //       message = `Finalizo tu intercambio con el jugador en cuarentena ${quarantine_player}, recibiste la carta ${card.name}`;
    //       severity = ChatMessageSeverity.WARNING;
    //     }
    //   } else {
    //     // CASO LOS DOS EN CUARENTENA
    //     const quarantine_first_player = exchange[0];
    //     const quarantine_second_player = exchange[1];
    //     store.dispatch(
    //       addChatMessage({
    //         type: ChatMessageType.GAME_MESSAGE,
    //         severity: ChatMessageSeverity.WARNING,
    //         message: `El jugador en cuarentena ${quarantine_first_player.player_name} le paso la
    //           carta ${quarantine_first_player.card.name} al jugador ${quarantine_second_player.player_name}`,
    //       })
    //     );
    //     severity = ChatMessageSeverity.WARNING;
    //     message = `El jugador en cuarentena ${quarantine_second_player.player_name} le paso la
    //           carta ${quarantine_second_player.card.name} al jugador ${quarantine_first_player.player_name}`;
    //   }
    // }
  } else {
    if (payload.quarantine == null) {
      // CASO NINGUNO EN CUARENTENA
      message = `Los jugadores ${first_player} y ${second_player} finalizaron su intercambio de cartas.`;
    } else {
      const exchange = payload.quarantine;
      if (exchange.length == 1) {
        // CASO UNO EN CUARENTENA Y EL OTRO NO
        const quarantine_player = exchange[0].player_name;
        const card = exchange[0].card;
        const other_player =
          quarantine_player == first_player ? second_player : first_player;
        message = `El jugador en cuarentena ${quarantine_player} le paso la carta ${card.name} al jugador ${other_player}`;
        severity = ChatMessageSeverity.WARNING;
        StandaloneToast(
          buildWarningToastOptions({
            position: "top-right",
            description: message,
            duration: 9000,
          })
        );
      } else {
        // CASO LOS DOS EN CUARENTENA
        const quarantine_first_player = exchange[0];
        const quarantine_second_player = exchange[1];
        StandaloneToast(
          buildWarningToastOptions({
            position: "top-right",
            description: `El jugador en cuarentena ${quarantine_first_player.player_name} le paso la 
            carta ${quarantine_first_player.card.name} al jugador ${quarantine_second_player.player_name}`,
            duration: 12000,
          })
        );
        store.dispatch(
          addChatMessage({
            type: ChatMessageType.GAME_MESSAGE,
            severity: ChatMessageSeverity.WARNING,
            message: `El jugador en cuarentena ${quarantine_first_player.player_name} le paso la 
            carta ${quarantine_first_player.card.name} al jugador ${quarantine_second_player.player_name}`,
          })
        );
        severity = ChatMessageSeverity.WARNING;
        message = `El jugador en cuarentena ${quarantine_second_player.player_name} le paso la 
            carta ${quarantine_second_player.card.name} al jugador ${quarantine_first_player.player_name}`;
        StandaloneToast(
          buildWarningToastOptions({
            position: "top-right",
            description: message,
            duration: 12000,
          })
        );
      }
    }
  }
  store.dispatch(
    addChatMessage({
      type: ChatMessageType.GAME_MESSAGE,
      severity,
      message,
    })
  );
}
