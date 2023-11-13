import {
  Card,
  CardTypes,
  GamePlayer,
  PlayerRole,
  PlayerStatus,
  PlayerTurnState,
} from "@/store/gameSlice";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { GameError, NotInGameError } from "@/src/utils/exceptions";
import { useMemo } from "react";

type PlayerGameState = {
  id: number;
  name: string;
  position: number;
  status: PlayerStatus;
  role: PlayerRole;
  turn: undefined | PlayerTurnState;
  cards: Card[];
  panicCards: Card[];
  on_turn: boolean;
  on_exchange: boolean;
  state: PlayerTurnState;
  quarantine: number;
  selections: {
    card: Card | undefined;
    player: number | undefined;
  };
  isHost: boolean;
};

const usePlayerGameState: () => PlayerGameState = () => {
  const gameState = useSelector((state: RootState) => state.game);
  const playerData = gameState.playerData;
  if (playerData == null) {
    throw new NotInGameError(
      "No se puede obtener el estado del jugador porque el juego no esta activo."
    );
  }

  const playerPublicData = gameState.players.find(
    (player: GamePlayer) => player.id == playerData.playerID
  );

  if (playerPublicData == null) {
    throw new GameError(
      "Inconsistencia en el estado, ID de jugador no esta en la lista publica de jugadores."
    );
  }

  const panicCards = useMemo(() => {
    return playerData.cards.filter((card) => {
      return card.type == CardTypes.PANIC;
    });
  }, [playerData.cards]);

  const playerState: PlayerGameState = {
    id: playerData.playerID,
    name: playerPublicData.name,
    position: playerPublicData.position,
    on_turn: playerPublicData.on_turn,
    on_exchange: playerPublicData.on_exchange,
    state: playerData.state,
    quarantine: playerPublicData.quarantine,
    status: playerPublicData.status,
    role: playerData.role,
    turn: undefined,
    cards: playerData.cards,
    panicCards: panicCards,
    selections: {
      card: playerData.cards.find((card) => card.id == playerData.cardSelected),
      player: playerData.playerSelected,
    },
    isHost: gameState.config.host == playerPublicData.name,
  };

  return playerState;
};

export default usePlayerGameState;
