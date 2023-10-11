import { PageWithLayout } from "@/src/pages/_app";
import { Box } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { buildSucessToastOptions } from "@/src/utils/toasts";
import useGameSocket from "@/src/hooks/useGameSocket";
import { EventType } from "@/src/business/game/gameAPI/listener";

const Page: PageWithLayout = () => {
  const toast = useToast();
  const { gameSocket } = useGameSocket();
  const roomStartHandler = () => {
    toast(buildSucessToastOptions({ description: "Partida iniciada" }));
  }
  useEffect(() => {
    gameSocket.on(EventType.ON_ROOM_START_GAME, roomStartHandler);
    return () => {
      gameSocket.removeListener(EventType.ON_ROOM_START_GAME, roomStartHandler);
    }
  });
  return <Box pos="relative">El juego!</Box>;
};

Page.authConfig = {
  gameAuthProtected: true,
};

export default Page;
