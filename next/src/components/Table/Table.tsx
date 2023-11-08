import { Box, BoxProps, Text, useDimensions } from "@chakra-ui/react";
import React, { FC, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  PlayerStatus,
  selectPlayer,
  setDiscardDeckDimensions,
  unselectPlayer,
} from "@/store/gameSlice";
import Player from "./Player";
import usePlayerGameState from "@/src/hooks/usePlayerGameState";
import { RootState } from "@/store/store";

type TableProps = BoxProps & {};

function getTranslatesForPosition(
  position: number,
  playerAmount: number
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

  function isAdjacent(playerSelectedPosition: number) {
    const rest = Math.abs(localPlayer.position - playerSelectedPosition);
    const alivePlayersAmount = players_data.filter(
      (p) => p.status == PlayerStatus.ALIVE
    ).length;
    return rest == 1 || rest == alivePlayersAmount - 1;
  }

  function onPlayerSelectedToggle(playerID: number) {
    const playerSelected = players_data.find((p) => p.id == playerID);
    // Si el jugador esta selecionado, lo des-seleccionamos
    if (selectedPlayerID === playerID) {
      dispatch(unselectPlayer());
      return;
    }
    // si la carta no requiere seleccionar jugagdor o no hay carta,
    // no hacemos nada
    if (
      localPlayer.selections.card === undefined ||
      !localPlayer.selections.card?.needTarget
    ) {
      return;
    }

    // si requiere seleccion y el jugador clickeado aplica, lo seleccionamos
    if (
      localPlayer.selections.card.targetAdjacentOnly === false ||
      isAdjacent(playerSelected!.position)
    ) {
      dispatch(selectPlayer(playerID));
    }
  }

  const discardCardRef = useRef(null);
  const dimensions = useDimensions(discardCardRef, true);

  useEffect(() => {
    if (dimensions == null) return;
    dispatch(setDiscardDeckDimensions(dimensions));
  }, [dimensions, dispatch]);

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
      {/* Discard card box */}
      <Box ref={discardCardRef} w="20%" aspectRatio={0.717749758} />

      {players.map((player: any) => {
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
