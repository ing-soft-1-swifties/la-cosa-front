import { Box, BoxProps, Text } from "@chakra-ui/react";
import {} from "path";
import { FC } from "react";
import { useDispatch } from "react-redux";
import IMG_AWAY_BACK from "@/public/cards/AlejateBack.png";
import IMG_ROTTEN_ROPES from "@/public/cards/CuerdasPodridas.png";
import IMG_INFECTED from "@/public/cards/Infectado.png";
import IMG_FLAMETHROWER from "@/public/cards/lanzallamas.png";
import IMG_NOBBQ from "@/public/cards/NadaDeBarbacoas.png";
import IMG_NOTHANKS from "@/public/cards/NoGracias.png";
import IMG_THETHING from "@/public/cards/LaCosa.png";
import IMG_ANALYSIS from "@/public/cards/Analisis.png";
import IMG_IM_FINE_HERE from "@/public/cards/AquiEstoyBien.png";
import IMG_SCARY from "@/public/cards/Aterrador.png";
import IMG_CHANGE_OF_LOCATION from "@/public/cards/CambioDeLugar.png";
import IMG_QUARANTINE from "@/public/cards/Cuarentena.png";
import IMG_DETERMINATION from "@/public/cards/Determinacion.png";
import IMG_YOU_FAILED from "@/public/cards/Fallaste.png";
import IMG_AXE from "@/public/cards/Hacha.png";
import IMG_YOU_BETTER_RUN from "@/public/cards/MasValeQueCorras.png";
import IMG_LOCKED_DOOR from "@/public/cards/PuertaAtrancada.png";
import IMG_SEDUCTION from "@/public/cards/Seduccion.png";
import IMG_SUSPICION from "@/public/cards/Sospecha.png";
import IMG_WATCH_YOUR_BACKS from "@/public/cards/VigilaTusEspaldas.png";
import IMG_WHISKEY from "@/public/cards/Whisky.png";
import IMG_UPS from "@/public/cards/Ups.png";
import IMG_BLIND_DATE from "@/public/cards/CitaCiegas.png";
import IMG_HERE_IS_THE_PARY from "@/public/cards/EsAquiEsLaFiesta.png";
import IMG_WE_CANT_NOT_BE_FRIENDS from "@/public/cards/NoPodemosSerAmigos.png";
import IMG_FORGETFUL from "@/public/cards/Olvidadizo.png";
import IMG_LET_IT_STAY_BETWEEN_US from "@/public/cards/QueQuedeEntreNosotros.png";
import IMG_REVELATIONS from "@/public/cards/Revelaciones.png";
import IMG_THREE_FOUR from "@/public/cards/TresCuatro.png";
import IMG_ONE_TWO from "@/public/cards/UnoDos.png";
import { StaticImageData } from "next/image";
import Image from "@/components/utility/Image";
import {
  PlayerTurnState,
  setMultiSelect,
  setSelectedCard,
} from "@/store/gameSlice";
import usePlayerGameState from "@/src/hooks/usePlayerGameState";
import { Card as CardData, CardTypes as CardType } from "@/store/gameSlice";

export enum CardTypes {
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
  UPS = "¡Ups!",
  BLIND_DATE = "Cita a ciegas",
  HERE_IS_THE_PARY = "Es Aqui La Fiesta",
  WE_CANT_NOT_BE_FRIENDS = "No Podemos Ser Amigos",
  FORGETFUL = "Olvidadizo",
  LET_IT_STAY_BETWEEN_US = "Que Quede Entre Nosotros",
  REVELATIONS = "Revelaciones",
  THREE_FOUR = "Tres, cuatro...",
  ONE_TWO = "Uno, dos...",
  AWAY_BACK = "Alejate Reversa",
  ROTTEN_ROPES = "Cuerdas podridas",
}

let ReverseCard = new Map<string, keyof typeof CardTypes>();
Object.keys(CardTypes).forEach((card) => {
  const key = card as keyof typeof CardTypes;
  const cardValue: string = CardTypes[key];
  ReverseCard.set(cardValue, key);
});

type CardsDataType = {
  [key in CardTypes]: {
    image: StaticImageData;
  };
};

const CardsData: CardsDataType = {
  [CardTypes.FLAMETHROWER]: {
    image: IMG_FLAMETHROWER,
  },
  [CardTypes.INFECTED]: {
    image: IMG_INFECTED,
  },
  [CardTypes.NOBBQ]: {
    image: IMG_NOBBQ,
  },
  [CardTypes.NOTHANKS]: {
    image: IMG_NOTHANKS,
  },
  [CardTypes.THETHING]: {
    image: IMG_THETHING,
  },
  [CardTypes.ANALYSIS]: {
    image: IMG_ANALYSIS,
  },
  [CardTypes.IM_FINE_HERE]: {
    image: IMG_IM_FINE_HERE,
  },
  [CardTypes.SCARY]: {
    image: IMG_SCARY,
  },
  [CardTypes.CHANGE_OF_LOCATION]: {
    image: IMG_CHANGE_OF_LOCATION,
  },
  [CardTypes.QUARANTINE]: {
    image: IMG_QUARANTINE,
  },
  [CardTypes.DETERMINATION]: {
    image: IMG_DETERMINATION,
  },
  [CardTypes.YOU_FAILED]: {
    image: IMG_YOU_FAILED,
  },
  [CardTypes.AXE]: {
    image: IMG_AXE,
  },
  [CardTypes.YOU_BETTER_RUN]: {
    image: IMG_YOU_BETTER_RUN,
  },
  [CardTypes.LOCKED_DOOR]: {
    image: IMG_LOCKED_DOOR,
  },
  [CardTypes.SEDUCTION]: {
    image: IMG_SEDUCTION,
  },
  [CardTypes.SUSPICION]: {
    image: IMG_SUSPICION,
  },
  [CardTypes.WATCH_YOUR_BACKS]: {
    image: IMG_WATCH_YOUR_BACKS,
  },
  [CardTypes.WHISKEY]: {
    image: IMG_WHISKEY,
  },
  [CardTypes.UPS]: {
    image: IMG_UPS,
  },
  [CardTypes.BLIND_DATE]: {
    image: IMG_BLIND_DATE,
  },
  [CardTypes.HERE_IS_THE_PARY]: {
    image: IMG_HERE_IS_THE_PARY,
  },
  [CardTypes.WE_CANT_NOT_BE_FRIENDS]: {
    image: IMG_WE_CANT_NOT_BE_FRIENDS,
  },
  [CardTypes.FORGETFUL]: {
    image: IMG_FORGETFUL,
  },
  [CardTypes.LET_IT_STAY_BETWEEN_US]: {
    image: IMG_LET_IT_STAY_BETWEEN_US,
  },
  [CardTypes.REVELATIONS]: {
    image: IMG_REVELATIONS,
  },
  [CardTypes.THREE_FOUR]: {
    image: IMG_THREE_FOUR,
  },
  [CardTypes.ONE_TWO]: {
    image: IMG_ONE_TWO,
  },
  [CardTypes.AWAY_BACK]: {
    image: IMG_AWAY_BACK,
  },
  [CardTypes.ROTTEN_ROPES]: {
    image: IMG_ROTTEN_ROPES,
  },
};

type CardProps = BoxProps & {
  card_id: number;
  name: string;
  shouldSelect?: boolean;
};

const GameCard: FC<CardProps> = ({
  card_id: id,
  name,
  shouldSelect = false,
  ...props
}) => {
  const player = usePlayerGameState();
  const dispatch = useDispatch();

  const card_key = ReverseCard.get(name);
  // var IMG_LOADED = false;
  var cardData = undefined;
  if (card_key == null) {
  } else {
    //sino se me rompe el linter
    const card = CardTypes[card_key];
    cardData = CardsData[card];
    // IMG_LOADED = true;
  }

  let borderProps: BoxProps = shouldSelect
    ? {
        borderColor:
          player.selections.card?.id === id // selecciono la carta y es la misma que la que tengo
            ? "green.500" // la pongo verde
            : player.cards.find((card) => card.id === id)?.type === CardType.PANIC // si no es la misma, es una carta de panico
            ? "purple.500" // la pongo morada
            : "black", // si no es ninguna de las dos, la pongo negra
      }
    : {
        borderColor: "black",
      };

 
  const card: CardData | undefined = player.cards.find((card) => card.id == id);
  let shouldBlur = false;
  if (shouldSelect && player.state == PlayerTurnState.PANICKING && card != null) {
    const isPanicCard = card!.type == CardType.PANIC;
    shouldBlur = card != null && card!.type != CardType.PANIC;
    if (player.card_picking_amount > 0) {
      shouldBlur = false;
      if (!isPanicCard) {
        const isSelected =
          player.multiSelect.away_selected.find(
            (card_id) => card_id == card!.id
          ) != null;
        borderProps = {
          borderColor: isSelected ? "green.500" : "black",
        };
      } else {
        borderProps = {
          borderColor: player.selections.card?.id == id ? "pink.500" : "black"
        }
      }
    }
  }

  return (
    <Box
      onClick={() => {
        if (shouldSelect && card != null) {
          if (player.state == PlayerTurnState.PANICKING) {
            if (card!.type == CardType.PANIC) {
              // Select de la carta de Panico
              dispatch(
                setSelectedCard(
                  player.selections.card?.id !== id ? id : undefined
                )
              );
            } else {
              // Select de las cartas de Alejate
              if (player.multiSelect) {
                // Si estamos en multiSelect:
                const isMultiSelected =
                  player.multiSelect.away_selected.find(
                    (card_id) => card_id == card!.id
                  ) != null;
                let multiSelectState = {
                  ...player.multiSelect,
                };
                if (isMultiSelected)
                  multiSelectState.away_selected =
                    player.multiSelect.away_selected.filter(
                      (card_id) => card_id != card!.id
                    );
                else if (
                  player.multiSelect.away_selected.length <
                  player.card_picking_amount
                )
                  multiSelectState.away_selected =
                    player.multiSelect.away_selected.concat([card!.id]);
                dispatch(setMultiSelect(multiSelectState));
              }
            }
          } else {
            dispatch(
              setSelectedCard(
                player.selections.card?.id !== id ? id : undefined
              )
            );
          }
        }
      }}
      backgroundColor="black"
      minH="full"
      h="full"
      w="auto"
      minW="auto"
      data-testid={`GAME_CARD_${id}`}
      bgColor="black"
      borderWidth="4px"
      borderRadius="lg"
      cursor="pointer"
      {...props}
      transform="auto"
      _hover={{
        scale: 1.1,
      }}
      transitionDuration="300ms"
      opacity={shouldBlur ? "0.4" : "1"}
      {...borderProps}
    >
      {cardData !== undefined ? (
        <Image
          w="auto"
          h="full"
          data-testid={`GAME_CARD_IMG_${id}`}
          src={cardData!.image}
          alt={"Card " + name}
          clipPath="inset(2% 4% 2% 2%)"
        />
      ) : (
        <>
          <Text color="white">Carta Indefinida:</Text>
          <Text color="white">{name}</Text>
        </>
      )}
    </Box>
  );
};

export default GameCard;




