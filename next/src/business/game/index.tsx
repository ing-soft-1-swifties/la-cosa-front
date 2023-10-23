import { GameState } from "@/store/gameSlice";

export function canGameStart(gameState: GameState) { // Si la cantidad de jugadores esta entre el minimo y el maximo, retorna true
  return (
    gameState.config.minPlayers <= gameState.players.length && 
    gameState.players.length <= gameState.config.maxPlayers
  );
}
