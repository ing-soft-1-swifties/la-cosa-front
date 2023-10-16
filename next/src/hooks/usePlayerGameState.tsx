import {
  Card,
  GamePlayer,
  PlayerRole,
  PlayerStatus,
  PlayerTurnState,
} from "@/store/gameSlice";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { GameError, NotInGameError } from "@/src/utils/exceptions";

type PlayerGameState = {
  id: number;
  position: number;
  status: PlayerStatus;
  role: PlayerRole;
  turn: undefined | PlayerTurnState;
  cards: Card[];
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

  const playerState: PlayerGameState = {
    id: playerData.playerID,
    position: playerPublicData.position,
    status: playerPublicData.status,
    role: playerData.role,
    turn: undefined,
    cards: playerData.cards,
    selections: {
      card: playerData.cards.find(card => card.id == playerData.cardSelected),
      player: playerData.playerSelected,
    },
    isHost: gameState.config.host == playerPublicData.name,
  };

  return playerState;
};

export default usePlayerGameState;
