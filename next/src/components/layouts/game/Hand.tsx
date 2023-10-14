import { Flex } from "@chakra-ui/react";
import { FC } from "react";
import GameCard from "./GameCard";
import usePlayerGameState from "hooks/usePlayerGameState";

type HandProps = {
  card_height?: string;
};

const Hand: FC<HandProps> = ({ card_height }) => {
  const player = usePlayerGameState();

  return (
    <Flex justify="center" h="100%" columnGap={10}>
      {player.cards.map(({ id, name }) => {
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
