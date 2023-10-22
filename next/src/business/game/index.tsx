import { GameState } from "@/store/gameSlice";

export function canGameStart(gameState: GameState) {
  return (
    gameState.config.minPlayers <= gameState.players.length && 
    gameState.players.length <= gameState.config.maxPlayers
  );
}
