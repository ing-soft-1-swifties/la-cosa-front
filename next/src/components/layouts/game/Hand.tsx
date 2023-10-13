import { Box, Center, Flex, Grid, HStack, SimpleGrid } from "@chakra-ui/react";
import { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import GameCard from "./GameCard";

type HandProps = {
  card_height?: string;
};

const Hand: FC<HandProps> = ({ card_height }) => {
  const personalData = useSelector((state: RootState) => state.game.playerData);
  const cardsList = personalData.cards;

  return (
    <Flex justify="center" h="100%" columnGap={10}>
      {cardsList?.map(({ id, name }) => {
        return (
          <GameCard
            alignSelf="stretch"
            h={card_height ?? "auto"}
            data-testid={"Hand_card_" + id}
            name={name}
            key={id}
            card_id={id}
          />
        );
      })}
    </Flex>
  );
};

export default Hand;
