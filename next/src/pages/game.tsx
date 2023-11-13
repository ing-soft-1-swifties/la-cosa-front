import { PageWithLayout } from "@/src/pages/_app";
import { Box, Flex, Text } from "@chakra-ui/react";
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
import { addChatMessage, ChatMessageType, PlayerRole } from "@/store/gameSlice";
import { Socket } from "socket.io-client";
import { store } from "@/store/store";
import ChatBox from "@/components/layouts/game/ChatBox";
import { useDispatch } from "react-redux";
import ModalShowCards from "@/components/layouts/game/ModalShowCards";

const Page: PageWithLayout = () => {
  const toast = useToast();
  const player = usePlayerGameState();
  const role = player.role;

  useGameNotifications(gameSocket, toast);

  const BG_IMG = role == PlayerRole.HUMAN ? ForestBGHuman : ForestBGInfect;

  return (
    <>
      <GameEnd />
      <ModalShowCards/>
      <Box pos="relative">
        {/* Imagen de fondo del Lobby */}
        <BgImage
          w="100%"
          imageProps={{
            src: BG_IMG,
            alt: "",
          }}
        />

        <ChatBox />

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
        {/* <Box pos="absolute" right="0" top="0">
          <Text
            color="white"
            bg={player.on_turn ? "green" : "yellow.600"}
            borderBottomLeftRadius="20px"
            px="16"
            py="3"
            textTransform="uppercase"
            fontWeight="bold"
            fontSize="0.98rem"
          >
            {player.on_turn ? "Es tu Turno" : "Esperando a otros jugadores..."}
          </Text>
        </Box> */}
      </Box>
    </>
  );
};

function useGameNotifications(gameSocket: Socket, toast: any) {
  const dispatch = useDispatch();
  const roomStartHandler = () => {
    toast(
      buildSucessToastOptions({
        title: "Aviso",
        description: "Partida iniciada",
      })
    );
  };
  const canceledRoom = () => {
    toast(
      buildSucessToastOptions({
        title: "Aviso",
        description: "Se cancelo la partida",
      })
    );
  };
  const playerPlayDefenseCard = (data: any) => {
    const chatMessage = {
      type: ChatMessageType.GAME_MESSAGE,
      message: `El jugador ${data.player} jugo la carta de defensa: ${data.card_name}`,
    };
    dispatch(addChatMessage(chatMessage));
    // toast(
    //   buildSucessToastOptions({
    //     title: "Aviso",
    //     description: `El jugador ${data.player} jugo la carta de defensa: ${data.card.name}`,
    //   })
    // );
  };

  const beginExchange = (data: any) => {
    const [firstPlayer, secondPlayer] = data.players;
    if (!data.players.includes(store.getState().user.name)) {
      const chatMessage = {
        type: ChatMessageType.GAME_MESSAGE,
        message: `Habrá un intercambio entre los jugadores ${firstPlayer} y ${secondPlayer}`,
      };
      dispatch(addChatMessage(chatMessage));
      // toast(
      //   buildSucessToastOptions({
      //     title: "Aviso",
      //     description: `Habrá un intercambio entre los jugadores ${firstPlayer} y ${secondPlayer}`,
      //   })
      // );
    }
  };

  useEffect(() => {
    gameSocket.on(EventType.ON_ROOM_START_GAME, roomStartHandler);
    gameSocket.on(EventType.ON_ROOM_CANCELLED_GAME, canceledRoom);
    gameSocket.on(
      EventType.ON_GAME_PLAYER_PLAY_DEFENSE_CARD,
      playerPlayDefenseCard
    );
    gameSocket.on(EventType.ON_GAME_BEGIN_EXCHANGE, beginExchange);
    return () => {
      gameSocket.removeListener(EventType.ON_ROOM_START_GAME, roomStartHandler);
      gameSocket.removeListener(EventType.ON_ROOM_CANCELLED_GAME, canceledRoom);
      gameSocket.removeListener(
        EventType.ON_GAME_PLAYER_PLAY_DEFENSE_CARD,
        playerPlayDefenseCard
      );
      gameSocket.removeListener(
        EventType.ON_GAME_BEGIN_EXCHANGE,
        beginExchange
      );
    };
  });
}

export default Page;

Page.authConfig = {
  gameAuthProtected: false,
};
