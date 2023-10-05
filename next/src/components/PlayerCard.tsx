import { Card, CardBody, Flex, Avatar, Text } from "@chakra-ui/react";
import { FC } from "react";

// Props del compononente de una tarjeta de jugador
type PlayerCardProps = {
  name: string;
};

// Componente de una tarjeta de jugador
const PlayerCard: FC<PlayerCardProps> = ({ name }) => {
  return (
    <Card pl={6}>
      <CardBody>
        <Flex align="center" columnGap={6}>
          <Avatar name={name} />
          <Text>{name}</Text>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default PlayerCard;
