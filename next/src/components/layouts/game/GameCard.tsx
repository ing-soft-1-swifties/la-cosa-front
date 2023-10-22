import { Box, BoxProps, Text } from "@chakra-ui/react";
import { } from "path";
import { FC } from "react";
import { useDispatch } from "react-redux";
import IMG_INFECTED from "@/public/cards/Infectado.png";
import IMG_FLAMETHROWER from "@/public/cards/lanzallamas.png";
import IMG_NOBBQ from "@/public/cards/NadaDeBarbacoas.png";
import IMG_NOTHANKS from "@/public/cards/NoGracias.png";
import IMG_THETHING from "@/public/cards/LaCosa.png";
import IMG_ANALYSIS from "@/public/cards/Analisis.png";
import IMG_IM_FINE_HERE from "@/public/cards/AquiEstoyBien.png";
import IMG_SCARY from "@/public/cards/Aterrador.png";
import IMG_CHANGE_OF_LOCATION from "@/public/cards/CambioDeLugar.png"
import IMG_QUARANTINE from "@/public/cards/Cuarentena.png"
import IMG_DETERMINATION from "@/public/cards/Determinacion.png"
import IMG_YOU_FAILED from "@/public/cards/Fallaste.png";
import IMG_AXE from "@/public/cards/Hacha.png";
import IMG_YOU_BETTER_RUN from "@/public/cards/MasValeQueCorras.png";
import IMG_LOCKED_DOOR from "@/public/cards/PuertaAtrancada.png";
import IMG_SEDUCTION from "@/public/cards/Seduccion.png";
import IMG_SUSPICION from "@/public/cards/Sospecha.png";
import IMG_WATCH_YOUR_BACKS from "@/public/cards/VigilaTusEspaldas.png";
import IMG_WHISKEY from "@/public/cards/Whisky.png";

import { StaticImageData } from "next/image";
import Image from "@/components/utility/Image";
import { setSelectedCard } from "@/store/gameSlice";
import usePlayerGameState from "@/src/hooks/usePlayerGameState";

type CardProps = BoxProps & { // Propiedades de la carta
  card_id: number;
  name: string;
};

enum Card { // Tipos de cartas
  FLAMETHROWER = "Lanzallamas",
  INFECTED = "Infectado",
  NOBBQ = "¡Nada de barbacoas!",
  NOTHANKS = "¡No, gracias!",
  THETHING = "La cosa",
  ANALYSIS = "Analisis",
  IM_FINE_HERE = "Aquí estoy bien",
  SCARY = "Aterrador",
  CHANGE_OF_LOCATION = "¡Cambio de lugar!",
  QUARANTINE = "Cuarentena",
  DETERMINATION = "Determinacion",
  YOU_FAILED = "¡Fallaste!",
  AXE = "Hacha",
  YOU_BETTER_RUN = "¡Más vale que corras!",
  LOCKED_DOOR = "Puerta atrancada",
  SEDUCTION = "Seducción",
  SUSPICION = "Sospecha",
  WATCH_YOUR_BACKS = "Vigila tus espaldas",
  WHISKEY = "Whisky",
};



let ReverseCard = new Map<string, keyof typeof Card>(); // lo que hace es que le asigna a cada key del enum Card, el valor de la key
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

const CardsData: CardsDataType = { // Datos de las cartas
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
  [Card.ANALYSIS]: {
    image: IMG_ANALYSIS,
  },
  [Card.IM_FINE_HERE]:{
    image: IMG_IM_FINE_HERE,
  },
  [Card.SCARY]:{
    image:IMG_SCARY ,
  },
  [Card.CHANGE_OF_LOCATION]:{
    image:IMG_CHANGE_OF_LOCATION ,
  },
  [Card.QUARANTINE]:{
    image: IMG_QUARANTINE,
  },
  [Card.DETERMINATION]:{
    image:IMG_DETERMINATION ,
  },
  [Card.YOU_FAILED]:{
    image:IMG_YOU_FAILED,
  },
  [Card.AXE]:{
    image:IMG_AXE,
  },
  [Card.YOU_BETTER_RUN]:{
    image:IMG_YOU_BETTER_RUN ,
  },
  [Card.LOCKED_DOOR]:{
    image:IMG_LOCKED_DOOR ,
  },
  [Card.SEDUCTION]:{
    image:IMG_SEDUCTION ,
  },
  [Card.SUSPICION]:{
    image:IMG_SUSPICION ,
  },
  [Card.WATCH_YOUR_BACKS]:{
    image:IMG_WATCH_YOUR_BACKS,
  },
  [Card.WHISKEY]:{
    image:IMG_WHISKEY,
  },
};

const GameCard: FC<CardProps> = ({ card_id: id, name, ...props }) => { // Carta del juego
  const player = usePlayerGameState(); 
  const dispatch = useDispatch();

  const card_key = ReverseCard.get(name); // Obtiene la key de la carta
  // var IMG_LOADED = false;
  var cardData = undefined;
  if (card_key == null) {
  } else { //sino se me rompe el linter
    const card = Card[card_key];
    cardData = CardsData[card];
    // IMG_LOADED = true;
  }

  return (
    <Box
      onClick={() => {
        dispatch(
          setSelectedCard(player.selections.card !== id ? id : undefined)
        );
      }}
      borderWidth="4px"
      borderRadius="lg"
      backgroundColor="black"
      minH='full'
      h="full"
      w="auto"
      minW="auto"
      data-testid={`GAME_CARD_${id}`}
      bgColor='black'
      borderColor={player.selections.card == id ? "green.500" : "black"}
      cursor="pointer"
      {...props}
      transform="auto"
      _hover={{
        scale: 1.1,
      }}
      transitionDuration="300ms"
    >
      {cardData !== undefined ?
        <Image
          w="auto"
          h="full"
          data-testid={`GAME_CARD_IMG_${id}`}
          src={cardData!.image}
          alt={"Card " + name}
          clipPath="inset(2% 4% 2% 2%)"
        />
        : <>
          <Text color='white'>
            Carta Indefinida: 
          </Text>
          <Text color='white'>
            {name}
          </Text>
        </>}
    </Box>
  );
};

export default GameCard;
