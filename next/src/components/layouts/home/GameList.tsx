import {
  Box,
  Card,
  CardBody,
  Flex,
  Heading,
  Spacer,
  Spinner,
  Text,
} from "@chakra-ui/react";
import {} from "path";
import { FC } from "react";
import { useGetGamesQuery } from "@/store/gameApi";

type GameListProps = {};

const GameList: FC<GameListProps> = () => { // Componente de la lista de partidas
  const {
    data: gameList,
    isError: gameListError,
    isLoading,
  } = useGetGamesQuery(undefined, { pollingInterval: 2000 }); // Crea un query para obtener las partidas

  return (// Crea un flex con las partidas
    <Box flexBasis="65%" px={16} py={10} pos="relative" data-testid="game-list">
      <Heading
        as="h2"
        mb={6}
        textAlign="center"
        textTransform="uppercase"
        color="white"
      >
        Partidas
      </Heading>

      {isLoading ? (
        <Spinner
          pos="absolute"
          top="45%"
          left="50%"
          transform="auto"
          translateX="-50%"
          translateY="-50%"
          size="xl"
          thickness="7px"
          color="green.400"
          data-testid="game-list_spinner"
        />
      ) : gameListError ? (
        <Text color="red.500" textAlign="center" fontSize="2xl" mt={20}>
          Error cargando la Lista de Partidas Disponibles
        </Text>
      ) : (
        <Flex flexWrap="wrap" rowGap={8} justify="space-between">
          {gameList?.map(({ id, name, players_count, max_players }) => {
            return (
              <Box key={id} flexBasis="100%">
                <GameCard
                  id={id}
                  name={name}
                  count={players_count}
                  max={max_players}
                />
              </Box>
            );
          })}
        </Flex>
      )}
    </Box>
  );
};

type GameCardProps = { // Propiedades de la carta del juego
  id: number;
  name: string;
  count: number;
  max: number;
};

const GameCard: FC<GameCardProps> = ({ id, name, count, max }) => { // Componente de la carta del juego
  return (//retorna una carta con el nombre, el id y la cantidad de jugadores
    <Card pl={6}>
      <CardBody>
        <Flex alignItems="center">
          <Text fontSize="2xl" fontWeight="bold" textAlign="center">
            {name}
          </Text>
          <Text fontSize="2xl" color="green.300" pl={2}>
            #{id}
          </Text>
          <Spacer />
          <Flex columnGap={3} alignItems="center">
            <Box
              borderWidth="1px"
              borderRadius="lg"
              p={2}
              verticalAlign="center"
              color="gray.800"
            >
              <Text>
                {count}/{max}
              </Text>
            </Box>

            {/* Codigo viejo, revisar si hace falta en algun momento: */}
            {/* <Button variant='outline' isDisabled={(count == max) && shearingPerLobby }>Entrar</Button> */}
            {/* <Button
              variant="outline"
              isDisabled={count == max && shearingPerLobby}
            >
              Proximamente
            </Button> */}
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default GameList;
