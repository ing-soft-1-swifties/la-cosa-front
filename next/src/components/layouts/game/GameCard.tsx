import { Box, BoxProps } from "@chakra-ui/react";
import {} from "path";
import { FC } from "react";
import { useDispatch } from "react-redux";
import IMG_INFECTED from "@/public/cards/Infectado.jpg";
import IMG_FLAMETHROWER from "@/public/cards/Lanzallamas.jpg";
import IMG_NOBBQ from "@/public/cards/NadaDeBarbacoas.jpg";
import IMG_NOTHANKS from "@/public/cards/NoGracias.jpg";
import IMG_THETHING from "@/public/cards/LaCosa.jpg";
import { StaticImageData } from "next/image";
import Image from "@/components/utility/Image";
import { setSelectedCard } from "@/store/gameSlice";
import usePlayerGameState from "@/src/hooks/usePlayerGameState";

type CardProps = BoxProps & {
  card_id: number;
  name: string;
};

enum Card {
  FLAMETHROWER = "Lanzallamas",
  INFECTED = "Infectado",
  NOBBQ = "¡Nada de barbacoas!",
  NOTHANKS = "¡No, gracias!",
  THETHING = "La cosa",
}

let ReverseCard = new Map<string, keyof typeof Card>();
Object.keys(Card).forEach((card) => {
  const key = card as keyof typeof Card;
  const cardValue: string = Card[key];
  ReverseCard.set(cardValue, key);
});

type CardsDataType = {
  [key in Card]: {
    image: StaticImageData;
  };
};

const CardsData: CardsDataType = {
  [Card.FLAMETHROWER]: {
    image: IMG_FLAMETHROWER,
  },
  [Card.INFECTED]: {
    image: IMG_INFECTED,
  },
  [Card.NOBBQ]: {
    image: IMG_NOBBQ,
  },
  [Card.NOTHANKS]: {
    image: IMG_NOTHANKS,
  },
  [Card.THETHING]: {
    image: IMG_THETHING,
  },
};

const GameCard: FC<CardProps> = ({ card_id: id, name, ...props }) => {
  const player = usePlayerGameState();
  const dispatch = useDispatch();

  const card_key = ReverseCard.get(name);
  if (card_key == null) {
    return <>Carta indefinida</>;
  }
  const card = Card[card_key];
  const cardData = CardsData[card];

  return (
    <Box
      onClick={() => {
        dispatch(
          setSelectedCard(player.selections.card != id ? id : undefined)
        );
      }}
      borderWidth="4px"
      borderRadius="lg"
      backgroundColor="black"
      h="full"
      w="auto"
      minW="auto"
      data-testid={`GAME_CARD_${id}`}
      borderColor={player.selections.card == id ? "green.500" : "black"}
      cursor="pointer"
      {...props}
      transform="auto"
      _hover={{
        scale: 1.1,
      }}
      transitionDuration="300ms"
    >
      <Image
        w="auto"
        h="full"
        data-testid={`GAME_CARD_IMG_${id}`}
        src={cardData.image}
        alt={"Card " + name}
        clipPath="inset(2% 4% 2% 2%)"
      />
    </Box>
  );
};

export default GameCard;
