import { Box, BoxProps } from "@chakra-ui/react";
import React, { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlayerStatus, selectPlayer, unselectPlayer } from "@/store/gameSlice";
import { RootState } from "@/store/store";
import Player from "./Player";
import usePlayerGameState from "@/src/hooks/usePlayerGameState";

type TableProps = BoxProps & {};

function getTranslatesForPosition(
  position: number,
  playerAmount: number,
): { x: number; y: number } {
  // Obtenemos el angulo para la posicion del jugador
  let angle = position * ((2 * Math.PI) / playerAmount);
  angle -= Math.PI / 2;

  // Devolvemos sus coordenadas en el círculo trigonométrico
  return { x: Math.cos(angle), y: Math.sin(angle) };
}

const Table: FC<TableProps> = ({ ...boxProps }) => {
  const localPlayer = usePlayerGameState();
  const playerID = localPlayer.id;
  const players_data = useSelector((state: RootState) => state.game.players);
  const players = players_data.filter(
    (p) => p.id !== playerID && p.status != PlayerStatus.DEATH
  );

  const selectedPlayerID = localPlayer.selections.player;

  const dispatch = useDispatch();

  if (localPlayer == undefined) {
    throw new Error("No player in the game has this player's id!");
  }

  function onPlayerSelectedToggle(playerID: number) {
    if (selectedPlayerID === playerID) {
      dispatch(unselectPlayer());
    } else {
      dispatch(selectPlayer(playerID));
    }
  }

  return (
    <Box
      w="auto"
      borderWidth="1px"
      h="100%"
      borderColor="gray"
      borderRadius="100%"
      aspectRatio="1"
      display="flex"
      justifyContent="center"
      alignItems="center"
      position="relative"
      bg="rgba(0, 0, 0, 0.4)"
      {...boxProps}
    >
      {players.map((player) => {
        const { x, y } = getTranslatesForPosition(
          player.position - (localPlayer.position as any),
          players.length + (localPlayer.status == PlayerStatus.ALIVE ? 1 : 0)
        );
        return (
          <Box
            key={player.name}
            position="absolute"
            left={`calc(50% + ${x * 62}%)`}
            bottom={`calc(50% + ${y * 62}%)`}
            onClick={() => onPlayerSelectedToggle(player.id)}
          >
            <Player player={player} selected={player.id === selectedPlayerID} />
          </Box>
        );
      })}
    </Box>
  );
};

export default Table;
