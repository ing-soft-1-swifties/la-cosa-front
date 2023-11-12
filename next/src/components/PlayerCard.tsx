import { Card, CardBody, Flex, Avatar, Text } from "@chakra-ui/react";
import { FC } from "react";
import { GamePlayer } from "@/store/gameSlice";
import PlayerAvatar from "./utility/PlayerAvatar";

// Props del compononente de una tarjeta de jugador
type PlayerCardProps = {
  player: GamePlayer;
};

// Componente de una tarjeta de jugador
const PlayerCard: FC<PlayerCardProps> = ({ player }) => {
  return (
    <Card pl={6}>
      <CardBody>
        <Flex align="center" columnGap={6}>
          <PlayerAvatar player={player} isSelected={false} />
          <Text>{player.name}</Text>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default PlayerCard;
