import { PageWithLayout } from "@/src/pages/_app";
import { Box, Flex } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { buildSucessToastOptions } from "@/src/utils/toasts";
import useGameSocket from "@/src/hooks/useGameSocket";
import GameTable from "@/src/components/Table";
import { EventType } from "@/src/business/game/gameAPI/listener";
import Hand from "@/src/components/layouts/game/Hand";
import ActionBox from "@/components/layouts/game/ActionBox";
import BgImage from "@/components/utility/BgImage";
import ForestBGHuman from "@/public/game/froest-background-humans.jpg";
import ForestBGInfect from "@/public/game/froest-background-infected.jpg";
import usePlayerGameState from "@/src/hooks/usePlayerGameState";
import GameEnd from "@/components/layouts/game/GameEnd";
import { Card, PlayerRole } from "@/store/gameSlice";
import { Socket } from "socket.io-client";

const Page: PageWithLayout = () => {
  const toast = useToast();
  const { gameSocket } = useGameSocket();
  const role = usePlayerGameState().role;

  useGameNotifications(gameSocket, toast);


  const BG_IMG = role == PlayerRole.HUMAN ? ForestBGHuman : ForestBGInfect;

  return (
    <>
      <GameEnd />
      <Box pos="relative">
        {/* Imagen de fondo del Lobby */}
        <BgImage
          w="100%"
          imageProps={{
            src: BG_IMG,
            alt: "",
          }}
        />

        <Flex flexDir="column" h="100vh" overflow="hidden">
          <Flex flex="1" justify="center" pt="32" pb="10">
            <GameTable />
          </Flex>
          <Flex flexBasis="30%" align="center" justify="space-around">
            <Box pl={3} pr={3}>
              <Hand card_height="14rem" />
            </Box>
            <Box>
              <ActionBox />
            </Box>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

Page.authConfig = {
  gameAuthProtected: true,
};

function useGameNotifications(gameSocket: Socket, toast: any) {
  const roomStartHandler = () => {
    toast(buildSucessToastOptions({ description: "Partida iniciada" }));
  };
  const playerTurnHandler = () => {
    toast(buildSucessToastOptions({ description: "Es el turno" }));
  };
  // const newPlayerRoom = () => {
  //   toast(buildSucessToastOptions({ description: "Nuevo jugador en la partida" }));
  // };
  // const leftPlayerRoom = () => {
  //   toast(buildSucessToastOptions({ description: "Un jugador abandonó la partida" }));
  // };
  const canceledRoom = () => {
    toast(buildSucessToastOptions({ description: "Se cancelo la partida" }));
  };
  const playerStealCard = (player:any, cards: Card[]) => {
    toast(buildSucessToastOptions({ description: `El jugador ${player.name} robó las cartas: ${cards.map(({name})=>`${name}, `)}` }));
  };
  const playerPlayCard = (player:any, cards: Card[]) => {
    toast(buildSucessToastOptions({ description: `El jugador ${player.name} jugo las cartas: ${cards.map(({name})=>`${name}, `)}` }));
  };
  const playerPlayDefenseCard = (player:any, cards: Card[]) => {
    toast(buildSucessToastOptions({ description: `El jugador ${player.name} jugo la carta de defensa: ${cards.map(({name})=>`${name}, `)}` }));
  };

  useEffect(() => {
    gameSocket.on(EventType.ON_ROOM_START_GAME, roomStartHandler);
    gameSocket.on(EventType.ON_GAME_PLAYER_TURN, playerTurnHandler);
    // gameSocket.on(EventType.ON_ROOM_NEW_PLAYER, newPlayerRoom);
    // gameSocket.on(EventType.ON_ROOM_LEFT_PLAYER, leftPlayerRoom);
    gameSocket.on(EventType.ON_ROOM_CANCELLED_GAME, canceledRoom);
    gameSocket.on(EventType.ON_GAME_PLAYER_STEAL_CARD, playerStealCard);
    gameSocket.on(EventType.ON_GAME_PLAYER_PLAY_CARD, playerPlayCard);
    gameSocket.on(EventType.ON_GAME_PLAYER_PLAY_DEFENSE_CARD, playerPlayDefenseCard);
    return () => {
      gameSocket.removeListener(EventType.ON_ROOM_START_GAME, roomStartHandler);
      gameSocket.removeListener(EventType.ON_GAME_PLAYER_TURN, playerTurnHandler);
      // gameSocket.removeListener(EventType.ON_ROOM_NEW_PLAYER, newPlayerRoom);
      // gameSocket.removeListener(EventType.ON_ROOM_LEFT_PLAYER, leftPlayerRoom);
      gameSocket.removeListener(EventType.ON_ROOM_CANCELLED_GAME, canceledRoom);
      gameSocket.removeListener(EventType.ON_GAME_PLAYER_STEAL_CARD, playerStealCard);
      gameSocket.removeListener(EventType.ON_GAME_PLAYER_PLAY_CARD, playerPlayCard);
      gameSocket.removeListener(EventType.ON_GAME_PLAYER_PLAY_DEFENSE_CARD, playerPlayDefenseCard);
    };
  });
}

//   ON_GAME_PLAYER_PLAY_CARD = "on_game_player_play_card",
//   ON_GAME_PLAYER_PLAY_DEFENSE_CARD = "on_game_player_play_defense_card",


//   ON_GAME_PLAYER_DISCARD_CARD = "on_game_player_discard_card",
//   ON_GAME_BEGIN_EXCHANGE = "on_game_begin_exchange",
//   ON_GAME_FINISH_EXCHANGE = "on_game_finish_exchange",
//   ON_GAME_PLAYER_DEATH = "on_game_player_death",
//   ON_GAME_END = "on_game_end",
//   ON_GAME_INVALID_ACTION = "on_game_invalid_action",

export default Page;
