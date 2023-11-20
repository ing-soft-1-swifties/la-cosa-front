import { Avatar, Box } from "@chakra-ui/react";
import React, { FC } from "react";
import { GamePlayer } from "@/store/gameSlice";
import { PiCrosshairBold } from "react-icons/pi";


type PlayerAvatarProps = {
  player: GamePlayer;
  isSelected: boolean;
};

const PlayerAvatar: FC<PlayerAvatarProps> = ({ player, isSelected }) => {
  return (
    <>
      <Avatar
        borderWidth="3px"
        size="lg"
        borderColor={isSelected ? "red" : "transparent"}
        src={"game/iconPlayer" + (player.id % 12) + ".png"}
        name={player.name}
      />
      {isSelected && (
          <Box
            position="absolute"
            zIndex={9999}
            top="15px"
            left="17px"
            color="red"
          >
            <PiCrosshairBold size={30} />
          </Box>
        )}
    </>
  );
};
export default PlayerAvatar;
