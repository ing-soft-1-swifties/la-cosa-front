import { PageWithLayout } from "@/src/pages/_app";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { FC, useState } from "react";

import DarkForestBackground from "@/public/lobby/DarkForest.webp";
import BgImage from "@/components/utility/BgImage";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import PlayerCard from "@/components/PlayerCard";
import { GameState } from "@/store/gameSlice";
import { leaveLobby, sendStartGame } from "@/src/business/game/gameAPI/manager";
import { canGameStart } from "@/src/business/game/";
import { useRouter } from "next/router";
import {
  buildErrorToastOptions,
  buildSucessToastOptions,
} from "@/src/utils/toasts";

const Page: PageWithLayout = () => { // Página del lobby
  const user = useSelector((state: RootState) => state.user); 
  const game = useSelector((state: RootState) => state.game);
  const isHost = game.config.host == user.name;

  return (
    <Box pos="relative">
      {/* Imagen de fondo del Lobby */}
      <BgImage
        w="100%"
        imageProps={{
          src: DarkForestBackground,
          alt: "",
        }}
      />

      {/* Contenido principal */}
      <Container maxW="100rem">
        <Flex flexDir="column" minH="100vh" pt={5} pb={10} px={4}>
          <Box py={4}>
            <Heading
              as="h1"
              fontSize="5xl"
              fontWeight="bold"
              textAlign="center"
              color="white"
            >
              Lobby {game.config.id}
            </Heading>
          </Box>
          <Flex flex="1" bg="rgba(70, 70, 70, 0.85)" borderRadius="3xl">
            {/* Seccion de los Jugadores en el Lobby: */}
            <Box flexBasis="65%" px={16} py={10}>
              <Heading
                as="h2"
                mb={6}
                textAlign="center"
                textTransform="uppercase"
                color="white"
              >
                Jugadores
              </Heading>
              <Flex
                flexWrap="wrap"
                rowGap={8}
                columnGap={8}
                justify="space-between"
              >
                {game.players.map((player) => {
                  return (
                    <Box key={player.name} flexBasis="48%">
                      <PlayerCard name={player.name} />
                    </Box>
                  );
                })}
              </Flex>
            </Box>

            {/* Seccion de Estado de la Partida */}
            <Box
              flex="1"
              bg="rgba(30, 30, 30, 0.7)"
              borderTopRightRadius="3xl"
              borderBottomRightRadius="3xl"
              pt={10}
              pb={10}
            >
              <Flex flexDir="column" justify="center" align="center">
                <Text
                  color="white"
                  fontWeight="bold"
                  fontSize="4xl"
                  mb={12}
                  textDecor="underline"
                >
                  {game.config.name}
                </Text>

                <Text color="white" fontWeight="bold" fontSize="lg">
                  Host: {game.config.host}
                </Text>
                <Text color="white" fontWeight="bold" fontSize="lg">
                  Minimo de Jugadores: {game.config.minPlayers}
                </Text>
                <Text color="white" fontWeight="bold" fontSize="lg">
                  Maximo de Jugadores: {game.config.maxPlayers}
                </Text>
                <Text color="white" fontWeight="bold" fontSize="lg" mb={10}>
                  Jugadores: {game.players.length}
                </Text>
                {!isHost && (
                  <Text
                    color="white"
                    fontWeight="bold"
                    fontSize="lg"
                    mb={10}
                    textDecor="underline"
                    textUnderlineOffset="4px"
                    textDecorationStyle="double"
                  >
                    Esperando a que el host inicie la partida
                  </Text>
                )}
                {isHost && <StartGameButton gameState={game} />}
                <LeaveLobbyButton />
              </Flex>
              <Box mx="auto"></Box>
            </Box>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

// Boton para inciar la partida
type StartGameButtonProps = {
  gameState: GameState;
};

const StartGameButton: FC<StartGameButtonProps> = ({ gameState }) => { // Componente del boton para iniciar la partida
  // Obtiene el estado del juego y el loading
  const [startLoading, setStartLoading] = useState(false);
  const startEnabled = canGameStart(gameState);
  const toast = useToast();
  const onInitHandle = async () => {
    // Inicia la partida y muestra un toast
    setStartLoading(true);
    sendStartGame()
      .catch((reason: any) => {
        toast( // Muestra un toast con el error
          buildErrorToastOptions({
            title: "Error iniciando partida",
            description: `${reason}`,
          })
        );
      })
      .finally(() => { // Finaliza el loading
        setStartLoading(false);
      });
  };

  return ( // Crea el boton para iniciar la partida
    <Tooltip
      label="No se cumplen los requisitos para iniciar el juego."
      display={startEnabled ? "none" : "auto"}
      data-testid="lobby_start_button_tooltip"
    >
      <Button
        data-testid="lobby_start_button"
        isDisabled={!startEnabled}
        isLoading={startLoading}
        onClick={onInitHandle}
        colorScheme="green"
        mb={6}
        size="lg"
      >
        Iniciar Partida
      </Button>
    </Tooltip>
  );
};

// Boton para salir del Lobby
const LeaveLobbyButton: FC<{}> = () => {
  return (
    <Button
      data-testid="lobby_leave_button"
      onClick={() => {
        leaveLobby();
      }}
      colorScheme="red"
      size="lg"
    >
      Salir del Lobby
    </Button>
  );
};

Page.authConfig = {
  gameAuthProtected: true,
};

export default Page;
