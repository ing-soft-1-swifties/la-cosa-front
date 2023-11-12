import { Avatar } from "@chakra-ui/react";
import React, { FC } from "react";
import { GamePlayer } from "@/store/gameSlice";

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
        borderColor={isSelected ? "green.500" : "transparent"}
        src={"game/iconPlayer" + (player.id % 12) + ".png"}
        name={player.name}
      />
    </>
  );
};
export default PlayerAvatar;
