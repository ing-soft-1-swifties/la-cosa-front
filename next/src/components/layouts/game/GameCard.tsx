import { Box, Flex } from "@chakra-ui/react";
import {} from "path";
import { FC } from "react";
import { useSelector } from "react-redux";
import { RootState, store } from "store/store";
import IMG_INFECTED from "@/public/cards/Infectado.jpg";
import IMG_FLAMETHROWER from "@/public/cards/Lanzallamas.jpg";
import IMG_NOBBQ from "@/public/cards/NadaDeBarbacoas.jpg";
import IMG_NOTHANKS from "@/public/cards/NoGracias.jpg";
import IMG_THETHING from "@/public/cards/LaCosa.jpg";
import Image, { StaticImageData } from "next/image";
import { setSelectedCard } from "@/store/gameSlice";

type CardProps = {
  id: number;
  name: string;
};

enum Card {
  FLAMETHROWER = "Lanzallamas",
  INFECTED = "Infectado",
  NOBBQ = "¡Nada de barbacoas!",
  NOTHANKS = "¡No, gracias!",
  THETHING = "La cosa"
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

const GameCard: FC<CardProps> = ({ id, name }) => {
  const game = useSelector((state: RootState) => state.game);

  const card_key = ReverseCard.get(name);
  if (card_key == null) {
    return <>Carta indefinida</>;
  }
  const card = Card[card_key];
  const cardData = CardsData[card];

  function setSelection(idSelected:number){
    store.dispatch(setSelectedCard(game.playerData.cardSelected != idSelected ? idSelected : undefined));
    console.log(game.playerData.cardSelected + "->" + idSelected);
}

  return (
    <Box
      onClick={() => {
        setSelection(id);
      }}
      borderWidth="7px"
      borderRadius="lg"
      backgroundColor='black'
      minH = 'full'
      borderColor={game.playerData.cardSelected == id ? "green.500" : "black"}
    >
      <Image
        src={cardData.image}
        alt={"Card " + name}
        style={{ clipPath: "inset(2% 4% 2% 2%)" }}
      />
    </Box>
  );
};

export default GameCard;
