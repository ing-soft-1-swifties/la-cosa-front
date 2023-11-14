import {
  Avatar,
  Box,
  Box as Flex,
  Text,
  keyframes,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";
import { GamePlayer } from "@/store/gameSlice";
import Image from "@/components/utility/Image";
import DIAMOND_IMG from "@/public/game/diamond.png";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { motion } from "framer-motion";
import { FramerMotionBox } from "@/src/utils/animations";
import MASK_ICON from "@/public/game/ToxicMask.webp";
import DANGER_ICON from "@/public/game/DangerCuarentine.webp";
import PlayerAvatar from "@/components/utility/PlayerAvatar";

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
          top="-40px"
          display={player.on_turn ? "block" : "none"}
          zIndex={10}
          key="diamondTurn"
          animate={{ y: [10, 0, 10] }}
          initial={{ y: 0 }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          <Image
            w="auto"
            h="30px"
            data-testid={`PLAYER_DIAMOND_IMG_`}
            src={DIAMOND_IMG}
            alt="PLAYER_DIAMOND"
          />
        </FramerMotionBox>
        <Tooltip label={player.name + (player.quarantine>0? ", Cuarentena: " + player.quarantine: "")} placement="right">
          <Box>
            <PlayerAvatar isSelected={selected} player={player} />
            <Text
              userSelect="none"
              color={selected ? "green.500" : "white"}
              textAlign="center"
              maxW="12ch"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              wordBreak="keep-all"
            >
              {player.name}
            </Text>
          </Box>
        </Tooltip>
        <Image
          position="absolute"
          zIndex={10}
          w="70px"
          h="auto"
          top="-3px"
          src={MASK_ICON}
          alt="MASK_ICON"
          display={player.quarantine > 0 ? "block" : "none"}
        />

        <Image
          position="absolute"
          zIndex={100}
          w="35px"
          h="auto"
          left="calc(50% + 10px)"
          top="0px"
          src={DANGER_ICON}
          alt="DANGER_ICON"
          display={player.quarantine > 0 ? "block" : "none"}
        />
      </Flex>
    </>
  );
};

export default Player;
