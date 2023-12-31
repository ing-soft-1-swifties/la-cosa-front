import { PageWithLayout } from "@/src/pages/_app";
import { Box, Button, Container, Flex, Heading } from "@chakra-ui/react";
import GreenForestBack from "@/public/home/GreenForestWall.jpg";
import GameList from "@/components/layouts/home/GameList";
import BgImage from "@/components/utility/BgImage";
import FormJoinLobby from "@/components/layouts/home/FormJoinLobby";
import NewGameModal from "@/components/modalCrearPartida";
import { useDisclosure } from "@chakra-ui/react";
import RULES from '@/public/index/rulesGame.pdf';

const Page: PageWithLayout = () => {
  const disclouseModal = useDisclosure();
  return (
    <Box pos="relative">
      <BgImage
        w="100%"
        imageProps={{
          src: GreenForestBack,
          alt: "",
        }}
      />
      <Container maxW="100rem">
        <Flex flexDir="column" minH="100vh" pt={5} pb={10} px={4}>
          <Box py={4}>
            <Heading
              as="h1"
              fontSize="5xl"
              fontWeight="bold"
              textAlign="center"
              color="white"
              data-testid="home_titulo"
            >
              LA COSA
            </Heading>
          </Box>

          <Flex flex="1" bg="rgba(70, 70, 70, 0.85)" borderRadius="3xl">
            <GameList />

            <Box
              flex="1"
              bg="rgba(30, 30, 30, 0.7)"
              borderTopRightRadius="3xl"
              borderBottomRightRadius="3xl"
              justifyContent="space-between"

              pt={10}
              pb={10}
            >
              <Flex
                p={2}
                rowGap={4}
                justifyContent="center"
                flexWrap="wrap"
                columnGap={6}
                justify="space-between"
              >

                <FormJoinLobby />
                <Box>
                  <NewGameModal disclouse={disclouseModal} />
                  <Button
                    data-testid="create-game-btn"
                    color="green"
                    onClick={disclouseModal.onOpen}
                  >
                    Crear Partida
                  </Button>
                </Box>
              </Flex>
              <Flex
                justifyContent="center"
                flexWrap="wrap"
                pt={15}
                >
                <Button
                  colorScheme="blue"
                  onClick={() => window.open("rulesGame.pdf")}
                >
                  Reglas
                </Button>
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </Container>
    </Box >
  );
};

export default Page;
