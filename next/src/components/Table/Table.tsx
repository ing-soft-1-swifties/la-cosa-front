import {
  Box,
  BoxProps,
  Flex,
  Icon,
  Text,
  Tooltip,
  useDimensions,
} from "@chakra-ui/react";
import React, { FC, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  PlayerStatus,
  selectPlayer,
  setDiscardDeckDimensions,
  setSelectedDoor,
  unselectDoor,
  unselectPlayer,
} from "@/store/gameSlice";
import Player from "./Player";
import Door from "@/components/Table/Door";
import usePlayerGameState from "@/src/hooks/usePlayerGameState";
import { RootState } from "@/store/store";
import {
  FaArrowUp,
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import GameCard, { CardTypes } from "@/components/layouts/game/GameCard";

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

function getTranslatesForPositionDoor(
  position: number,
  playerAmount: number
): { x: number; y: number } {
  // Obtenemos el angulo para la posicion del jugador
  let angle = position * ((2 * Math.PI) / playerAmount);
  angle -= Math.PI / 2;
  angle += Math.PI / playerAmount;

  // Devolvemos sus coordenadas en el círculo trigonométrico
  return { x: Math.cos(angle), y: Math.sin(angle) };
}

const Table: FC<TableProps> = ({ ...boxProps }) => {
  const localPlayer = usePlayerGameState();
  const playerID = localPlayer.id;
  const gameDirection = useSelector((state: RootState) => state.game.direction);
  const players_data = useSelector((state: RootState) => state.game.players);
  const doors = useSelector((state: RootState) => state.game.doors_positions);
  const selectablePlayers = useSelector(
    (state: RootState) => state.game.playerData?.selectable_players
  );
  const players = players_data.filter(
    (p) => p.id !== playerID && p.status != PlayerStatus.DEATH
  );

  const selectedPlayerID = localPlayer.selections.player;
  const selectedDoor = localPlayer.selections.door;

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

  function isAdjacentDoor(door: number) {
    const alivePlayersAmount = players_data.filter(
      (p) => p.status == PlayerStatus.ALIVE
    ).length;
    const positionLeft =
      localPlayer.position - 1 < 0
        ? alivePlayersAmount - 1
        : localPlayer.position - 1;
    return door == positionLeft || door == localPlayer.position;
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
    )
      return;

    // si la carta es hacha no se puede seleccionar a alguien q no este en cuarentena
    if (
      localPlayer.selections.card.name == CardTypes.AXE &&
      playerSelected?.quarantine == 0
    )
      return;

    // No permitir seleccion de jugadores si el back explícitamente
    // manda la lista `selectable_players` sin ser vacía
    if (
      selectablePlayers != null &&
      selectablePlayers!.length > 0 &&
      !selectablePlayers!.includes(playerSelected!.name)
    ) {
      return;
    }

    // si requiere seleccion y el jugador clickeado aplica, lo seleccionamos
    if (
      localPlayer.selections.card.targetAdjacentOnly === false ||
      isAdjacent(playerSelected!.position)
    ) {
      dispatch(selectPlayer(playerID));
      dispatch(unselectDoor());
    }
  }

  function onDoorSelectedToggle(door: number) {
    // Si la puerta esta selecionada, la des-seleccionamos
    if (selectedDoor === door) {
      dispatch(unselectDoor());
      return;
    }
    // si la carta no requiere seleccionar jugagdor o no hay carta,
    // no hacemos nada
    // HARDCODEO FEO UNICA CARTA A USAR CON PUERTA ES HACHA
    if (
      localPlayer.selections.card === undefined ||
      localPlayer.selections.card?.name != CardTypes.AXE
    ) {
      return;
    }
    // si requiere seleccion y la puerta clickeada aplica, lo seleccionamos
    if (isAdjacentDoor(door)) {
      dispatch(setSelectedDoor(door));
      dispatch(unselectPlayer());
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
      <Box
        pos="absolute"
        top="50%"
        left="50%"
        transform="auto"
        translateX="-50%"
        translateY="-50%"
      >
        <LastPlayedCard />
      </Box>

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
            transition="all"
            transitionDuration="1400ms"
            onClick={() => onPlayerSelectedToggle(player.id)}
          >
            <Player player={player} selected={player.id === selectedPlayerID} />
          </Box>
        );
      })}

      {doors?.map((door: number) => {
        const { x, y } = getTranslatesForPositionDoor(
          door - (localPlayer.position as any),
          players.length + (localPlayer.status == PlayerStatus.ALIVE ? 1 : 0)
        );
        return (
          <Box
            key={door}
            position="absolute"
            left={`calc(50% + ${x * 62}%)`}
            bottom={`calc(50% + ${y * 62}%)`}
            transition="all"
            transitionDuration="1400ms"
            onClick={() => onDoorSelectedToggle(door)}
          >
            <Door isSelected={selectedDoor == door} position={door} />
          </Box>
        );
      })}

      <Tooltip label={localPlayer.name} placement="bottom">
        <Text
          pos="absolute"
          bottom={0}
          transform="auto"
          translateY="100%"
          color="white"
          pt="4"
          userSelect="none"
          textAlign="center"
          maxW="12ch"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          wordBreak="keep-all"
        >
          {localPlayer.name}
        </Text>
      </Tooltip>

      {/* Top */}
      <Box
        pt="4"
        pos="absolute"
        top="0"
        left="50%"
        transform="auto"
        translateX="-50%"
      >
        <Icon
          fontSize="1.2rem"
          color="green.500"
          as={gameDirection ? FaArrowLeft : FaArrowRight}
        />
      </Box>
      {/* Bottom */}
      <Box
        pb="4"
        pos="absolute"
        top="100%"
        left="50%"
        transform="auto"
        translateX="-50%"
        translateY="-100%"
      >
        <Icon
          fontSize="1.2rem"
          color="green.500"
          as={gameDirection ? FaArrowRight : FaArrowLeft}
        />
      </Box>
      {/* Left */}
      <Box
        ml="4"
        pos="absolute"
        top="50%"
        left="0"
        transform="auto"
        translateY="-50%"
      >
        <Icon
          fontSize="1.2rem"
          color="green.500"
          as={gameDirection ? FaArrowDown : FaArrowUp}
        />
      </Box>
      {/* Right */}
      <Box
        pr="4"
        pos="absolute"
        top="50%"
        left="100%"
        transform="auto"
        translateX="-100%"
        translateY="-50%"
      >
        <Icon
          fontSize="1.2rem"
          color="green.500"
          as={gameDirection ? FaArrowUp : FaArrowDown}
        />
      </Box>
    </Box>
  );
};

type LastPlayedCardProps = {};
const LastPlayedCard: FC<LastPlayedCardProps> = () => {
  const lastPlayedCard = useSelector(
    (state: RootState) => state.game.lastPlayedCard
  );
  return (
    <Flex
      flexDir="column"
      align="center"
      justify="center"
      translateX="0px"
      translateY="0px"
    >
      <>
        {lastPlayedCard != null && (
          <Text color="white" fontWeight="bold" textAlign="center">
            Jugada por:
            <br />
            <Text as="span" textDecor="none">
              {lastPlayedCard.player_name}
            </Text>
          </Text>
        )}

        <Box h="11rem" mb="4" w="max-content">
          {lastPlayedCard == null ? (
            <GameCard
              card_id={0}
              name={CardTypes.AWAY_BACK}
              shouldSelect={false}
            />
          ) : (
            <GameCard
              card_id={lastPlayedCard.card_id}
              name={lastPlayedCard.card_name}
              shouldSelect={false}
            />
          )}
        </Box>
        {lastPlayedCard != null && lastPlayedCard.player_target && (
          <Text color="white" fontWeight="bold" textAlign="center">
            Sobre:
            <br />
            {lastPlayedCard!.player_target}
          </Text>
        )}
      </>
    </Flex>
  );
};

export default Table;
