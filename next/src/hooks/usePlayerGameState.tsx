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

type PlayerGameState = { // Estado del jugador
  id: number;
  position: number;
  status: PlayerStatus;
  role: PlayerRole;
  turn: undefined | PlayerTurnState;
  cards: Card[];
  selections: {
    card: number | undefined;
    player: number | undefined;
  };
  isHost: boolean;
};
// Hook que obtiene el estado del jugador
const usePlayerGameState: () => PlayerGameState = () => { 
  // Obtiene el estado de la partida y el estado del jugador
  const gameState = useSelector((state: RootState) => state.game); 
  const playerData = gameState.playerData;
  // Si el jugador es null, lanza un error
  if (playerData == null) {
    throw new NotInGameError(
      "No se puede obtener el estado del jugador porque el juego no esta activo."
    );
  }
  // Obtiene los datos publicos del jugador
  const playerPublicData = gameState.players.find( 
    (player: GamePlayer) => player.id == playerData.playerID //
  );

  if (playerPublicData == null) { // Si no encuentra el jugador, lanza un error
    throw new GameError(
      "Inconsistencia en el estado, ID de jugador no esta en la lista publica de jugadores."
    );
  }

  const playerState: PlayerGameState = { // Crea el estado del jugador
    id: playerData.playerID,
    position: playerPublicData.position,
    status: playerPublicData.status,
    role: playerData.role,
    turn: undefined,
    cards: playerData.cards,
    selections: {
      card: playerData.cardSelected,
      player: playerData.playerSelected,
    },
    isHost: gameState.config.host == playerPublicData.name,
  };

  return playerState;
};

export default usePlayerGameState;
