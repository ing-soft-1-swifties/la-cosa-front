import { Box, Flex, useDimensions } from "@chakra-ui/react";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import GameCard from "./GameCard";
import usePlayerGameState from "@/src/hooks/usePlayerGameState";
import { PlayerStatus } from "@/store/gameSlice";
import { FramerMotionBox } from "@/src/utils/animations";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { AnimatePresence, useIsPresent } from "framer-motion";
import React from "react";

type HandProps = {
  card_height?: string;
};

const Hand: FC<HandProps> = ({ card_height }) => {
  const player = usePlayerGameState();
  const sortedCards = useMemo(
    () => [...player.cards].sort((c1, c2) => c1.id - c2.id),
    [player.cards]
  );

  if (player.status == PlayerStatus.DEATH) return null;

  return (
    <Flex justify="center" h="100%" columnGap={10}>
      <AnimatePresence mode="popLayout">
        {sortedCards.map(({ id, name }) => {
          return (
            <AnimatedGameCard key={id} {...{ id, name, height: card_height }} />
          );
        })}
      </AnimatePresence>
    </Flex>
  );
};
type AnimatedGameCardProps = {
  id: number;
  name: string;
  height: string | undefined;
};
const AnimatedGameCard = React.forwardRef<
  HTMLDivElement,
  AnimatedGameCardProps
>(({ id, name, height }, cardRef) => {
  const discardDeckDimensions = useSelector(
    (state: RootState) => state.game.discardDeckDimensions
  );
  let leftRel = 0;
  let topRel = 0;

  // Todo por que useDimensions no anda!
  const ref = cardRef as any;
  if (ref.current != null) {
    const rect = ref.current.getBoundingClientRect();
    leftRel =
      -(rect.left - (discardDeckDimensions?.borderBox.left ?? 0)) -
      (rect.width - (discardDeckDimensions?.borderBox.width ?? 0)) / 2;
    topRel =
      -(rect.top - (discardDeckDimensions?.borderBox.top ?? 0)) -
      (rect.height - (discardDeckDimensions?.borderBox.height ?? 0)) / 2;
  }
  return (
    <FramerMotionBox
      ref={cardRef}
      exit={{ y: topRel, x: leftRel, opacity: 0 }}
      initial={{ y: 400, x: 0 }}
      animate={{ y: 0 }}
      // @ts-ignore
      transition={{ duration: 0.8 }}
    >
      <GameCard
        alignSelf="stretch"
        h={height ?? "auto"}
        data-testid={"Hand_card_" + id}
        name={name}
        card_id={id}
        shouldSelect={true}
      />
    </FramerMotionBox>
    // <FramerMotionBox
    //   key={id}
    //   animate={{ y: 0 }}
    //   initial={{ y: 400 }}
    //   // @ts-ignore
    //   transition={{ duration: 0.8 }}
    // >
    //   <GameCard
    //     alignSelf="stretch"
    //     h={card_height ?? "auto"}
    //     data-testid={"Hand_card_" + id}
    //     name={name}
    //     card_id={id}
    //   />
    // </FramerMotionBox>
  );
});

AnimatedGameCard.displayName = "AnimatedGameCard";

export default Hand;
