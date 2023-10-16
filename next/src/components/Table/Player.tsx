import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";
import { GamePlayer } from "@/store/gameSlice";

const Player = ({
  player,
  selected = false,
}: {
  player: GamePlayer;
  selected: boolean;
}) => {
  return (
    <>
      <Box
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
      >
        <Avatar
          borderWidth="4px"
          borderColor={selected ? "green.500" : "transparent"}
        />
        <Text
          userSelect="none"
          color={selected ? "green.500" : "white"}
          textAlign="center"
        >
          {player.name}
        </Text>
      </Box>
    </>
  );
};

export default Player;
