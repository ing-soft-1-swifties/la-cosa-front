import { Avatar, Box, Box as Flex, Text, keyframes } from "@chakra-ui/react";
import React from "react";
import { GamePlayer } from "@/store/gameSlice";
import Image from "@/components/utility/Image";
import DIAMOND_IMG from "@/public/game/diamond.png";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { motion } from "framer-motion";
import { FramerMotionBox } from "@/src/utils/animations";
import ICON_PLAYER_1 from "@/public/game/IconPlayer1.png";
import ICON_PLAYER_2 from "@/public/game/IconPlayer2.png";
import ICON_PLAYER_3 from "@/public/game/IconPlayer3.png";
import ICON_PLAYER_4 from "@/public/game/iconPlayer4.png";
import ICON_PLAYER_5 from "@/public/game/IconPlayer5.png";
import ICON_PLAYER_6 from "@/public/game/IconPlayer6.png";
import ICON_PLAYER_7 from "@/public/game/IconPlayer7.png";
import ICON_PLAYER_8 from "@/public/game/IconPlayer8.png";
import ICON_PLAYER_9 from "@/public/game/IconPlayer9.png";
import ICON_PLAYER_10 from "@/public/game/IconPlayer10.png";
import ICON_PLAYER_11 from "@/public/game/IconPlayer11.png";
import ICON_PLAYER_12 from "@/public/game/IconPlayer12.png";
import MASK_ICON1 from '@/public/game/ToxicMask.png'
import MASK_ICON from '@/public/game/ToxicMask.webp'
import DANGER_ICON from '@/public/game/DangerCuarentine.webp'


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
            // src={DIAMOND_IMG}
            src={DIAMOND_IMG}
            alt="PLAYER_DIAMOND"
          />
        </FramerMotionBox>
        <Avatar
          borderWidth="3px"
          size='lg'
          borderColor={selected ? "green.500" : "transparent"}
          src={"game/iconPlayer" + (player.id % 12) + ".png"}
          name={player.name}
        />

        <Image
          position="absolute"
          zIndex={10}
          w="70px"
          h="auto"
          bottom='25px'
          src={MASK_ICON}
          alt="MASK_ICON"
          display={player.on_turn ? "block" : "none"}
        />

        <Image
          position="absolute"
          zIndex={100}
          w="35px"
          h="auto"
          left='calc(50% + 10px)'
          bottom='60px'
          src={DANGER_ICON}
          alt="DANGER_ICON"
          display={player.on_turn ? "block" : "none"}
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



