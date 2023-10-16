import { PageWithLayout } from "@/src/pages/_app";
import { Box, Flex } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { buildSucessToastOptions } from "@/src/utils/toasts";
import { gameSocket } from "@/src/business/game/gameAPI";
import GameTable from "@/src/components/Table";
import { EventType } from "@/src/business/game/gameAPI/listener";
import Hand from "@/src/components/layouts/game/Hand";
import ActionBox from "@/components/layouts/game/ActionBox";
import BgImage from "@/components/utility/BgImage";
import ForestBGHuman from "@/public/game/froest-background-humans.jpg";
import ForestBGInfect from "@/public/game/froest-background-infected.jpg";
import usePlayerGameState from "@/src/hooks/usePlayerGameState";
import GameEnd from "@/components/layouts/game/GameEnd";
import { PlayerRole } from "@/store/gameSlice";
import { Socket } from "socket.io-client";

const Page: PageWithLayout = () => {
  const toast = useToast();
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
  const playerTurnHandler = (data:any) => {
    toast(buildSucessToastOptions({ description: `Es el turno de ${data.player}` }));
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
  const playerStealCard = (data:any) => {
    toast(buildSucessToastOptions({ description: `Robaste las cartas: ${data.cards}` }));
  };
  const playerPlayCard = (data:any) => {
    toast(buildSucessToastOptions({ description: `El jugador ${data.player} jugo la carta: ${data.card}` }));
  };
  const playerPlayDefenseCard = (data:any) => {
    toast(buildSucessToastOptions({ description: `El jugador ${data.player} jugo la carta de defensa: ${data.cards}` }));
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

export default Page;
