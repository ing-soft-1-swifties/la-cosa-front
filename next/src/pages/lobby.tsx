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
import BgImage from "components/utility/BgImage";

const PLAYERS = [
  "Tomas Ponce",
  "Franco Molina",
  "Victoria Lopez",
  "Lautaro Ebner",
  "El Profe",
  "Alejito",
  "Pepito",
];

const Page: PageWithLayout = () => {
  return (
    <Box pos="relative">
      <BgImage
        w="100%"
        imageProps={{
          src: DarkForestBackground,
          alt: "",
        }}
      />
      <Container maxW="100rem">
        <Flex flexDir="column" minH="100vh" pt={5} pb={10} px={4}>
          <Box py={4}>
            <Heading as="h1" fontSize="5xl" fontWeight="bold" textAlign="center" color="white">
              Lobby #04
            </Heading>
          </Box>
          <Flex flex="1" bg="rgba(70, 70, 70, 0.85)" borderRadius="3xl">
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
                {PLAYERS.map((player) => {
                  return (
                    <Box key={player} flexBasis="48%">
                      <PlayerCard name={player} />
                    </Box>
                  );
                })}
              </Flex>
            </Box>
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
                  Host: Pepito
                </Text>
                <Text color="white" fontWeight="bold" fontSize="lg">
                  Minimo de Jugadores: 4
                </Text>
                <Text color="white" fontWeight="bold" fontSize="lg">
                  Maximo de Jugadores: 12
                </Text>
                <Text color="white" fontWeight="bold" fontSize="lg" mb={10}>
                  Jugadores: 6
                </Text>
                <Button colorScheme="green" mb={6} size="lg">
                  Iniciar Partida
                </Button>
                <Button colorScheme="red" size="lg">
                  Salir del Lobby
                </Button>
              </Flex>
              <Box mx="auto"></Box>
            </Box>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

type PlayerCardProps = {
  name: string;
};

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
