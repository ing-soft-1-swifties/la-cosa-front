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
import { PlayerRole } from "@/store/gameSlice";
import { Socket } from "socket.io-client";
import { store } from "@/store/store";

const Page: PageWithLayout = () => {
  const toast = useToast();
  const player = usePlayerGameState();
  const role = player.role;

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
        <Box pos="absolute" right="0" top="0">
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
        </Box>
      </Box>
    </>
  );
};

Page.authConfig = {
  gameAuthProtected: true,
};

function useGameNotifications(gameSocket: Socket, toast: any) {
  const roomStartHandler = () => {
    toast(
      buildSucessToastOptions({
        title: "Aviso",
        description: "Partida iniciada",
      })
    );
  };
  const playerTurnHandler = (data: any) => {
    toast(
      buildSucessToastOptions({
        title: "Aviso",
        description: `Es el turno de ${data.player}`,
      })
    );
  };
  // const newPlayerRoom = () => {
  //   toast(buildSucessToastOptions({ description: "Nuevo jugador en la partida" }));
  // };
  // const leftPlayerRoom = () => {
  //   toast(buildSucessToastOptions({ description: "Un jugador abandonó la partida" }));
  // };
  const canceledRoom = () => {
    toast(
      buildSucessToastOptions({
        title: "Aviso",
        description: "Se cancelo la partida",
      })
    );
  };
  const playerStealCard = (data: any) => {
    toast(
      buildSucessToastOptions({
        title: "Aviso",
        description: `Robaste las cartas: ${data.cards.reduce(
          (ac: string, card: any) => ac + `${card.name} `,
          ""
        )}`,
      })
    );
  };
  const playerPlayCard = (data: any) => {
    toast(
      buildSucessToastOptions({
        title: "Aviso",
        description: `El jugador ${data.player} jugo la carta: ${data.card.name}`,
      })
    );
  };
  const playerPlayDefenseCard = (data: any) => {
    toast(
      buildSucessToastOptions({
        title: "Aviso",
        description: `El jugador ${data.player} jugo la carta de defensa: ${data.card.name}`,
      })
    );
  };

  const beginExchange = (data: any) => {
    const [firstPlayer, secondPlayer] = data.players;
    if (!data.players.includes(store.getState().user.name)) {
      toast(
        buildSucessToastOptions({
          title: "Aviso",
          description: `Habrá un intercambio entre los jugadores ${firstPlayer} y ${secondPlayer}`,
        })
      );
    }
  };

  useEffect(() => {
    gameSocket.on(EventType.ON_ROOM_START_GAME, roomStartHandler);
    gameSocket.on(EventType.ON_GAME_PLAYER_TURN, playerTurnHandler);
    gameSocket.on(EventType.ON_ROOM_CANCELLED_GAME, canceledRoom);
    gameSocket.on(EventType.ON_GAME_PLAYER_STEAL_CARD, playerStealCard);
    gameSocket.on(EventType.ON_GAME_PLAYER_PLAY_CARD, playerPlayCard);
    gameSocket.on(
      EventType.ON_GAME_PLAYER_PLAY_DEFENSE_CARD,
      playerPlayDefenseCard
    );
    gameSocket.on(EventType.ON_GAME_BEGIN_EXCHANGE, beginExchange);
    return () => {
      gameSocket.removeListener(EventType.ON_ROOM_START_GAME, roomStartHandler);
      gameSocket.removeListener(
        EventType.ON_GAME_PLAYER_TURN,
        playerTurnHandler
      );
      gameSocket.removeListener(EventType.ON_ROOM_CANCELLED_GAME, canceledRoom);
      gameSocket.removeListener(
        EventType.ON_GAME_PLAYER_STEAL_CARD,
        playerStealCard
      );
      gameSocket.removeListener(
        EventType.ON_GAME_PLAYER_PLAY_CARD,
        playerPlayCard
      );
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
