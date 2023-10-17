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
import { PlayerRole } from "@/store/gameSlice";
import GameEnd from "@/components/layouts/game/GameEnd";
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

  useEffect(() => {
    gameSocket.on(EventType.ON_ROOM_START_GAME, roomStartHandler);
    gameSocket.on(EventType.ON_GAME_PLAYER_TURN, playerTurnHandler);
    return () => {
      gameSocket.removeListener(EventType.ON_ROOM_START_GAME, roomStartHandler);
      gameSocket.removeListener(EventType.ON_GAME_PLAYER_TURN, playerTurnHandler);
    };
  });
}

export default Page;
