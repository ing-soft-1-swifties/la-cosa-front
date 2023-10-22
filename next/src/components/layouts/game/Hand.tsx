import { Flex } from "@chakra-ui/react";
import { FC } from "react";
import GameCard from "./GameCard";
import usePlayerGameState from "@/src/hooks/usePlayerGameState";
import { PlayerStatus } from "@/store/gameSlice";

type HandProps = { // Propiedades de la mano
  card_height?: string;
};

const Hand: FC<HandProps> = ({ card_height }) => { // Componente de la mano
  const player = usePlayerGameState();

  if (player.status == PlayerStatus.DEATH) { 
    return null;
  }

  return ( // Crea un flex con las cartas de la mano
    <Flex justify="center" h="100%" columnGap={10}>
      {player.cards.map(({ id, name }) => {
        return (
          <GameCard
            alignSelf="stretch"
            h={card_height ?? "auto"}
            data-testid={"Hand_card_" + id}
            name={name}
            key={id}
            card_id={id}
          />
        );
      })}
    </Flex>
  );
};

export default Hand;
