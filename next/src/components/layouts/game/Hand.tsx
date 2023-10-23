import { Flex } from "@chakra-ui/react";
import { FC, useMemo } from "react";
import GameCard from "./GameCard";
import usePlayerGameState from "@/src/hooks/usePlayerGameState";
import { PlayerStatus } from "@/store/gameSlice";
import { FramerMotionBox } from "@/src/utils/animations";

type HandProps = {
  card_height?: string;
};

const Hand: FC<HandProps> = ({ card_height }) => {
  const player = usePlayerGameState();
  const sortedCards = useMemo(() => [...player.cards].sort((c1, c2) => c1.id - c2.id), [player.cards])

  if (player.status == PlayerStatus.DEATH) {
    return null;
  }

  return (
    <Flex justify="center" h="100%" columnGap={10}>
      {sortedCards.map(({ id, name }) => {
        return (
          <FramerMotionBox
            key={id}
            animate={{ y: 0 }}
            initial={{ y: 400 }}
            // @ts-ignore
            transition={{ duration: 0.8 }} 
          >
            <GameCard
              alignSelf="stretch"
              h={card_height ?? "auto"}
              data-testid={"Hand_card_" + id}
              name={name}
              card_id={id}
            />
          </FramerMotionBox>
        );
      })}
    </Flex>
  );
};

export default Hand;
