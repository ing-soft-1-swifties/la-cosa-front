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
  
  const playerDiscardCard = () => {
    toast(buildSucessToastOptions({ description: "Carta de Descarte" }));
  };
  const beginExchange = () => {
    toast(buildSucessToastOptions({ description: "Comienza Intercambio" }));
  };

  const finishExchange = () => {
    toast(buildSucessToastOptions({ description: "Termino el Intercambio" }));
  };
  const playerDeath = () => {
    toast(buildSucessToastOptions({ description: "Murio" }));
  };
  const GameEnd = () => {
    toast(buildSucessToastOptions({ description: "Juego Terminado" }));
  };
  const InvalidAction = () => {
    toast(buildSucessToastOptions({ description: "Accion Invalida" }));
  };

  useEffect(() => {
    gameSocket.on(EventType.ON_ROOM_START_GAME, roomStartHandler);
    gameSocket.on(EventType.ON_GAME_PLAYER_TURN, playerTurnHandler);
    gameSocket.on(EventType.ON_GAME_PLAYER_DISCARD_CARD,playerDiscardCard);
    gameSocket.on(EventType.ON_GAME_BEGIN_EXCHANGE,beginExchange);
    gameSocket.on(EventType.ON_GAME_FINISH_EXCHANGE,finishExchange);
    gameSocket.on(EventType.ON_GAME_PLAYER_DEATH ,playerDeath);
    gameSocket.on(EventType.ON_GAME_END,GameEnd);
    gameSocket.on(EventType.ON_GAME_INVALID_ACTION,InvalidAction);
    return () => {
      gameSocket.removeListener(EventType.ON_ROOM_START_GAME, roomStartHandler);
      gameSocket.removeListener(EventType.ON_GAME_PLAYER_TURN, playerTurnHandler);
      gameSocket.removeListener(EventType.ON_GAME_PLAYER_DISCARD_CARD,playerDiscardCard);
      gameSocket.removeListener(EventType.ON_GAME_BEGIN_EXCHANGE,beginExchange);
      gameSocket.removeListener(EventType.ON_GAME_FINISH_EXCHANGE,finishExchange);
      gameSocket.removeListener(EventType.ON_GAME_PLAYER_DEATH ,playerDeath);
      gameSocket.removeListener(EventType.ON_GAME_END,GameEnd );
      gameSocket.removeListener(EventType.ON_GAME_INVALID_ACTION,InvalidAction);
    };
  });
}



// ON_ROOM_NEW_PLAYER = "on_room_new_player",
//   ON_ROOM_LEFT_PLAYER = "on_room_left_player",
//   ON_ROOM_CANCELLED_GAME = "on_room_cancelled_game",
//   ON_GAME_PLAYER_STEAL_CARD = "on_game_player_steal_card",
//   ON_GAME_PLAYER_PLAY_CARD = "on_game_player_play_card",
//   ON_GAME_PLAYER_PLAY_DEFENSE_CARD = "on_game_player_play_defense_card",



//   ON_GAME_PLAYER_DISCARD_CARD = "on_game_player_discard_card",
//   ON_GAME_BEGIN_EXCHANGE = "on_game_begin_exchange",
//   ON_GAME_FINISH_EXCHANGE = "on_game_finish_exchange",
//   ON_GAME_PLAYER_DEATH = "on_game_player_death",
//   ON_GAME_END = "on_game_end",
//   ON_GAME_INVALID_ACTION = "on_game_invalid_action",



export default Page;
