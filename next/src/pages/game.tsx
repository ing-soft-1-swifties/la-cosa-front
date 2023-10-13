import { PageWithLayout } from "@/src/pages/_app";
import { Box, Grid, GridItem, HStack, Text } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { buildSucessToastOptions } from "@/src/utils/toasts";
import useGameSocket from "@/src/hooks/useGameSocket";
import GameTable from "@/src/components/Table";
import { EventType } from "@/src/business/game/gameAPI/listener";
import Hand from "@/src/components/layouts/game/Hand";
import ActionBox from "@/components/layouts/game/ActionBox";
import BgImage from "components/utility/BgImage";
import ForestBGHuman from '@/public/game/froest-background-humans.jpg'
import ForestBGInfected from '@/public/game/froest-background-infected.jpg'

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
  return (
    <Box pos="relative">
      {/* Imagen de fondo del Lobby */}
      <BgImage
        w="100%"
        imageProps={{
          src: ForestBGHuman,
          alt: "",
        }}
      />
      <Grid
        templateAreas={`"header header"
                  "main main"
                  "footer footer"`}
        gridTemplateRows={'10vh 60vh 30vh'}
        // gridTemplateColumns={'150px 1fr'}
        // h='200px'
        gap='1'
        color='blackAlpha.700'
        fontWeight='bold'
      >

        <GridItem pl='2' area={'header'}>
          <Text fontSize='4xl' color='greenyellow'>
            LA COSA
          </Text>
        </GridItem>

        <GridItem pl='2' area={'main'}>
          <GameTable />
        </GridItem>

        <GridItem pl='2' area={'footer'} >
          <HStack justify='space-between' maxH="10rem" pl={3} pr={3}>
            <Hand />
            <ActionBox />
          </HStack>
        </GridItem>

      </Grid>
    </Box>


  );
};

Page.authConfig = {
  gameAuthProtected: false,
};

export default Page;
