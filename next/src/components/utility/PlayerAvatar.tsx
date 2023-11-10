import { Avatar, Box, Box as Flex, Text, keyframes } from "@chakra-ui/react";
import React from "react";
import { GamePlayer } from "@/store/gameSlice";
import { useSelector } from "react-redux";
import { RootState } from "store/store";

const PlayerAvatar = (player: GamePlayer, isSelected: boolean) => {
    return (
        <>
            <Avatar
                borderWidth="3px"
                size='lg'
                borderColor={isSelected ? "green.500" : "transparent"}
                src={"game/iconPlayer" + (player.id % 12) + ".png"}
                name={player.name}
            />
        </>
    );
};
export default PlayerAvatar;



