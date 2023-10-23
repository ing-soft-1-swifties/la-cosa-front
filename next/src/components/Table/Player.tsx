import { Avatar, Box, Box as Flex, Text, keyframes } from "@chakra-ui/react";
import React from "react";
import { GamePlayer } from "@/store/gameSlice";
import Image from "@/components/utility/Image";
import DIAMOND_IMG from "@/public/game/diamond.png";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { motion } from "framer-motion";
import { FramerMotionBox } from "utils/animations";

const Player = ({
  player,
  selected = false,
}: {
  player: GamePlayer;
  selected: boolean;
}) => {
  const name_turn = useSelector(
    (state: RootState) => state.game.player_in_turn
  );

  return (
    <>
      <Flex
        key={player.name}
        transform="auto"
        translateX="-50%"
        translateY="50%"
        data-testid={`player`}
        cursor="pointer"
        _hover={{
          scale: 1.12,
        }}
        transitionDuration="300ms"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        position="relative"
      >
        <FramerMotionBox
          position="absolute"
          top='-40px'
          display={player.on_turn ? "block" : "none"}
          zIndex={2}

          key="diamondTurn"
          animate={{ y: [10,0,10] }}
          initial={{ y: 0 }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          <Image
            position="absolute"
            top="-34px"
            display={player.name !== name_turn ? "none" : "block"}
            w="auto"
            h="30px"
            data-testid={`PLAYER_DIAMOND_IMG_`}
            src={DIAMOND_IMG}
            alt="PLAYER_DIAMOND"
          />
        </FramerMotionBox>
        <Avatar
          borderWidth="4px"
          borderColor={selected ? "green.500" : "transparent"}
          name={player.name}
        />
        <Text
          userSelect="none"
          color={selected ? "green.500" : "white"}
          textAlign="center"
        >
          {player.name}
        </Text>
      </Flex>
    </>
  );
};

export default Player;
