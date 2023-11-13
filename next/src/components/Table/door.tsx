import { Image, Flex, Text } from "@chakra-ui/react";
import React, { FC } from "react";
import { GamePlayer } from "@/store/gameSlice";
import IMG_DOOR from "@/public/game/DoorRotten.png";

type DoorProps = {
  position: number;
  isSelected: boolean;
};

export const DoorElem: FC<DoorProps> = ({ position, isSelected }) => {
  return (
      <Flex
        key={position}
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
        <Image
          w="auto"
          h="full"
          data-testid={`DOOR_IMG_${position}`}
          borderWidth="3px"
          borderColor={isSelected ? "green.500" : "transparent"}
          src={IMG_DOOR.src}
          alt={"Card " + name}
          clipPath="inset(2% 4% 2% 2%)"
        />
      </Flex>
  );
};

// export default Door;
