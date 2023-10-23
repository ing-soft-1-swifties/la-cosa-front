import { Button, Text, Popover, PopoverBody, Stack, PopoverTrigger, PopoverContent, PopoverHeader, Box, } from "@chakra-ui/react";
import { FC } from "react";
import {
  GiBroadsword,
  GiFireShield,
  GiSwitchWeapon,
  GiChaliceDrops,
} from "react-icons/gi";
import { sendPlayerDiscardCard, sendPlayerPlayCard, sendPlayerSelectDefenseCard, sendPlayerSelectExchangeCard } from "@/src/business/game/gameAPI/manager";
import usePlayerGameState from "@/src/hooks/usePlayerGameState";
import { CardSubTypes, PlayerRole, PlayerStatus, PlayerTurnState } from "@/store/gameSlice";
import { Card } from "./GameCard";

type ActionBoxProps = {};

const ActionBox: FC<ActionBoxProps> = ({ }) => {
  const player = usePlayerGameState();
  const cardSelected = player.selections.card;
  const cardSelectedID = cardSelected?.id;
  const {turn, on_exchange, on_turn} = player;

  const playCard = () => {
    const playerSelected = player.selections.player;

    var cardOptions = playerSelected ? { target: playerSelected } : {};
    if (cardSelectedID !== undefined) {
      sendPlayerPlayCard(cardSelectedID, cardOptions);
    }
  };

  const discardCard = () => {
    if (cardSelectedID !== undefined) {
      sendPlayerDiscardCard(cardSelectedID);
    }
  };

  const swapCard = () => {
    if (cardSelectedID !== undefined) {
      sendPlayerSelectExchangeCard(cardSelectedID);
    }
  };

  const defenseCard = () => {
    if (cardSelectedID !== undefined) {
      sendPlayerSelectDefenseCard(cardSelectedID);
    }
  };

  if (player.status == PlayerStatus.DEATH) {
    return null;
  }

  let popoverTitle = "No estás en tu turno!";
  let popoverText = "Debes esperar la acción de otros jugadores.";

  if (on_turn && !on_exchange) {
    popoverTitle = "Tu turno!";
    popoverText = "Elije una carta para jugar o descartar.";
  } else if(on_turn && on_exchange) {
    popoverTitle = "Ofrece un intercambio!";
    popoverText = "Elije una carta para intercambiar con el otro jugador.";
  } else if(!on_turn && on_exchange) {
    popoverTitle = "Te han ofrecido un intercambio!";
    popoverText = "Elije una carta para intercambiar o para defenderte del el otro jugador.";
  }

  return (
    <Box mx="5">
      <Popover isOpen placement="top">
        <PopoverContent 
          bg="rgba(0, 0, 0, 0.4)" 
          color="white" 
          borderWidth="1px"
          borderColor="gray"
        >
          <PopoverHeader borderColor="gray">{popoverTitle}</PopoverHeader>
          <PopoverBody>{popoverText}</PopoverBody>
        </PopoverContent>
        <PopoverTrigger>
          <Stack maxW="20vw" data-testid={`HAND`} justify="center">
            {
              on_turn && !on_exchange && <>
                <Button
                  colorScheme="whiteAlpha"
                  data-testid="ACTION_BOX_PLAY_BTN"
                  onClick={playCard}
                  rightIcon={<GiBroadsword />}
                  isDisabled={cardSelectedID == undefined ||
                    cardSelected?.name == Card.THETHING ||
                    cardSelected?.name == Card.INFECTED ||
                    (cardSelected?.needTarget && player.selections.player == undefined)
                  }
                // TODO: a futuro nos fijamos en PlayerTurnState
                // isDisabled={cardSelectedID == undefined && turn !== PlayerTurnState.PLAY_OR_DISCARD && cardSelected?.name == Card.THETHING}
                >Jugar
                </Button>

                <Button
                  colorScheme='whiteAlpha'
                  data-testid="ACTION_BOX_DSC_BTN"
                  rightIcon={<GiChaliceDrops />}
                  onClick={discardCard}
                  isDisabled={cardSelectedID == undefined || cardSelected?.name == Card.THETHING}
                >Descartar
                </Button>
              </>

            }

            {
              on_exchange && !on_turn && <Button
                colorScheme='whiteAlpha'
                data-testid="ACTION_BOX_DEFENSE_BTN"
                onClick={defenseCard}
                rightIcon={<GiFireShield />}
                isDisabled={cardSelectedID == undefined || cardSelected?.subType !== CardSubTypes.DEFENSE}
              >Defenderse
              </Button>
            }

            {
              on_exchange && <Button
              colorScheme='whiteAlpha'
              data-testid="ACTION_BOX_SWAP_BTN"
              rightIcon={<GiSwitchWeapon />}
              onClick={swapCard}
              isDisabled={
                cardSelectedID == undefined ||
                cardSelected?.name == Card.THETHING ||
                (cardSelected?.name == Card.INFECTED && player.role == PlayerRole.HUMAN)
                // TODO: la condicion de abajo esta incompleta. 
                // tambien le falta que sea la unica carta de infectado en la mano
                // || (cardSelected?.name == Card.INFECTED && player.role == PlayerRole.INFECTED) 
              }
            >Intercambiar
              {turn}</Button>
            }
          </Stack>
        </PopoverTrigger>
      </Popover>
    </Box>
  );
};

export default ActionBox;
