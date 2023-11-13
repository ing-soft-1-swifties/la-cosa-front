import { Avatar, Flex, Box } from "@chakra-ui/react";
import React, { FC } from "react";
import { GamePlayer } from "@/store/gameSlice";
import Image from "@/components/utility/Image";
import IMG_DOOR from "@/public/game/DoorRotten.png";
import { GiSelect } from "react-icons/gi";
import { PiCrosshairBold } from "react-icons/pi";

type DoorProps = {
  isSelected: boolean;
  position: number;
};

const Door: FC<DoorProps> = ({ position, isSelected }) => {
  return (
    <>
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
        zIndex={30}
        w="60px"
        // borderColor={isSelected ? "green.500" : "transparent"}
        borderColor={isSelected ? "red.500": "transparent" }
        borderRadius={10}
        borderWidth="3px"
        // backgroundColor="green"
      >
        <Image
          //   position="absolute"
          borderColor={isSelected ? "green.500" : "transparent"}
          borderWidth="3px"
          zIndex={100}
          h="auto"
          w="auto"
          left="calc(50% + 10px)"
          top="0px"
          src={IMG_DOOR}
          alt={"DOOR_ICON_" + position}
        />
        <Box position="absolute">
          <PiCrosshairBold />
        </Box>
      </Flex>
    </>
  );
};
export default Door;
