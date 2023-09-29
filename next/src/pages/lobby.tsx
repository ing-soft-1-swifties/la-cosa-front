import { PageWithLayout } from "@/src/pages/_app";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import { FC } from "react";

import DarkForestBackground from "@/public/lobby/DarkForest.webp";
import BgImage from "@/components/utility/BgImage";
import { useSelector } from "react-redux";
import { RootState } from "store/store";

const Page: PageWithLayout = () => {
  const user = useSelector((state: RootState) => state.user);
  const game = useSelector((state: RootState) => state.game);
  const isHost = game.host == user.name;

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
              Lobby #{game.id}
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
              pt={24}
              pb={10}
            >
              <Flex flexDir="column" justify="center" align="center">
                <Text color="white" fontWeight="bold" fontSize="lg">
                  Host: {game.host}
                </Text>
                <Text color="white" fontWeight="bold" fontSize="lg">
                  Minimo de Jugadores: {game.minPlayers}
                </Text>
                <Text color="white" fontWeight="bold" fontSize="lg">
                  Maximo de Jugadores: {game.maxPlayers}
                </Text>
                <Text color="white" fontWeight="bold" fontSize="lg" mb={10}>
                  Jugadores: {game.players.length}
                </Text>
                {isHost && <StartGameButton />}
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
const StartGameButton: FC<{}> = () => {
  return (
    <Button colorScheme="green" mb={6} size="lg">
      Iniciar Partida
    </Button>
  );
};

// Boton para salir del Lobby
const LeaveLobbyButton: FC<{}> = () => {
  return (
    <Button colorScheme="red" size="lg">
      Salir del Lobby
    </Button>
  );
};

// Props del compononente de una tarjeta de jugador
type PlayerCardProps = {
  name: string;
};

// Componente de una tarjeta de jugador
const PlayerCard: FC<PlayerCardProps> = ({ name }) => {
  return (
    <Card pl={6}>
      <CardBody>
        <Flex align="center" columnGap={6}>
          <Avatar name={name} />
          <Text>{name}</Text>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default Page;
