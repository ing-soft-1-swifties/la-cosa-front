import { Box, Center, Flex, Grid, HStack, SimpleGrid } from "@chakra-ui/react";
import { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import GameCard from "./GameCard";

type HandProps = {};

const Hand: FC<HandProps> = ({}) => {
  const personalData = useSelector((state: RootState) => state.game.playerData);
  const cardsList = personalData.cards;

  return (
    <Center h='100%' >
      <HStack h='100%' justify='center'>
        {cardsList?.map(({ id, name }) => {
          return (
            <Box maxW="20%" alignSelf="stretch"  h="auto" key={id}>
              <GameCard id={id} data-testid={"Hand_card_" + id} name={name} />
            </Box>
          );
        })}
      </HStack>
    </Center>
  );
};

export default Hand;
