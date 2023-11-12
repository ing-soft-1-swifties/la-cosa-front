import {
  Button,
  Text,
  Popover,
  PopoverBody,
  Stack,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  Box,
} from "@chakra-ui/react";
import { FC, useState } from "react";
import {
  GiBroadsword,
  GiFireShield,
  GiDeathSkull,
  GiSwitchWeapon,
  GiChaliceDrops,
  GiSharpedTeethSkull,
} from "react-icons/gi";
import {
  sendFinishGame,
  sendPlayerDiscardCard,
  sendPlayerPlayCard,
  sendPlayerPlayDefenseCard,
  sendPlayerPlayNoDefense,
  sendPlayerSelectDefenseCardOnExchange,
  sendPlayerSelectExchangeCard,
} from "@/src/business/game/gameAPI/manager";
import usePlayerGameState from "@/src/hooks/usePlayerGameState";
import {
  CardSubTypes,
  PlayerRole,
  PlayerStatus,
  PlayerTurnState,
} from "@/store/gameSlice";
import { CardTypes } from "./GameCard";
import { useSelector } from "react-redux";
import { RootState } from "store/store";

type ActionBoxProps = {};

const ActionBox: FC<ActionBoxProps> = ({ }) => {
  const player = usePlayerGameState();
  const cardSelected = player.selections.card;
  const cardSelectedID = cardSelected?.id;
  const { turn, on_exchange, on_turn, state} = player;
  const playerSelected = player.selections.player;
  const on_defense = (state == PlayerTurnState.DEFENDING);
  const lastPlayedCard = useSelector(
    (state: RootState) => state.game.lastPlayedCard
  );
  const playCard = () => {
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

  const defenseCardOnExchange = () => {
    if (cardSelectedID !== undefined) {
      sendPlayerSelectDefenseCardOnExchange(cardSelectedID);
    }
  };

  const defenseCard = () => {
    if (cardSelectedID !== undefined) {
      sendPlayerPlayDefenseCard(cardSelectedID);
    }
  };

  const noDefense = () => {
    sendPlayerPlayNoDefense()
  };

  
  const [exchangedSelect, setExchangeSelected] = useState(false);

  if (player.status == PlayerStatus.DEATH) {
    return null;
  }

  let popoverTitle = "No estás en tu turno!";
  let popoverText = "Debes esperar la acción de otros jugadores.";

  if (on_turn && !on_exchange) {
    popoverTitle = "Tu turno!";
    popoverText = selectMessageText();
  } else if (on_turn && on_exchange) {
    popoverTitle = "Ofrece un intercambio!";
    popoverText = "Elije una carta para intercambiar con el otro jugador.";
  } else if (!on_turn && on_exchange) {
    popoverTitle = "Te han ofrecido un intercambio!";
    popoverText = "Elije una carta para intercambiar o para defenderte del el otro jugador.";
  } else if (on_defense) {
    popoverTitle = "Te estan atacando!";
    popoverText = "Elije una carta para defenderte o no te podras defender.";
  }

  function selectMessageText() {
    if (cardSelected == undefined) {
      return "Seleccione una carta para jugar o descartar"
    }
    if (cardSelected.targetAdjacentOnly && playerSelected == undefined) {
      return "La carta seleccionada necesita un objetivo adyacente"
    }
    if (cardSelected?.needTarget && playerSelected == undefined) {
      return "La carta seleccionada necesita un objetivo"
    }
    if (cardSelected.subType == CardSubTypes.DEFENSE) {
      return "Las cartas de defensa solo se pueden descartar";
    }
    if (cardSelected?.name == CardTypes.THETHING) {
      return "La carta seleccionada no se puede jugar o descartar"
    }
    return "Seleccione la acción a realizar"
  }

  function canUseDefensCard() {
    if (cardSelected != undefined && lastPlayedCard != undefined) { 
      return (cardSelected.name == CardTypes.NOBBQ && lastPlayedCard.card_name == CardTypes.FLAMETHROWER) ||
        (cardSelected.name == CardTypes.IM_FINE_HERE && lastPlayedCard.card_name == (CardTypes.YOU_BETTER_RUN || CardTypes.CHANGE_OF_LOCATION))
    } else {
      return false;
    }
  }

  if (exchangedSelect && !on_exchange) {
    setExchangeSelected(false);
  }


  return (
    <Box mx="5">
      <Popover isOpen placement="top" autoFocus={false}>
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
            {on_turn && !on_exchange && (
              <>
                <Button
                  colorScheme="whiteAlpha"
                  data-testid="ACTION_BOX_PLAY_BTN"
                  onClick={playCard}
                  rightIcon={<GiBroadsword />}
                  isDisabled={
                    cardSelectedID == undefined ||
                    cardSelected?.name == CardTypes.THETHING ||
                    cardSelected?.name == CardTypes.INFECTED ||
                    cardSelected?.subType == CardSubTypes.DEFENSE ||
                    (cardSelected?.needTarget &&
                      player.selections.player == undefined)
                  }
                // TODO: a futuro nos fijamos en PlayerTurnState
                // isDisabled={cardSelectedID == undefined && turn !== PlayerTurnState.PLAY_OR_DISCARD && cardSelected?.name == Card.THETHING}
                >
                  Jugar
                </Button>

                <Button
                  colorScheme="whiteAlpha"
                  data-testid="ACTION_BOX_DSC_BTN"
                  rightIcon={<GiChaliceDrops />}
                  onClick={discardCard}
                  isDisabled={
                    cardSelectedID == undefined ||
                    cardSelected?.name == CardTypes.THETHING
                  }
                >
                  Descartar
                </Button>
              </>
            )}

            {(on_defense || (on_exchange && !on_turn)) && (
              <Button
                colorScheme="whiteAlpha"
                data-testid="ACTION_BOX_DEFENSE_BTN"
                onClick={on_defense? defenseCard : defenseCardOnExchange}
                rightIcon={<GiFireShield />}
                isDisabled={
                  cardSelectedID == undefined ||
                  cardSelected?.subType !== CardSubTypes.DEFENSE ||
                  canUseDefensCard()
                }
              >
                Defenderse
              </Button>
            )}
            {player.role == PlayerRole.THETHING && (  <Button
                colorScheme="whiteAlpha"
                data-testid="ACTION_BOX_THETHING_END_BTN"
                onClick={sendFinishGame}
                rightIcon={<GiSharpedTeethSkull />}
                isDisabled={!on_turn}
              >
                Finalizar
              </Button>

            )}
            {(on_defense) && (
              <Button
                colorScheme="whiteAlpha"
                data-testid="ACTION_BOX_NO_DEFENSE_BTN"
                onClick={noDefense}
                rightIcon={<GiDeathSkull />}
              >
                No Defenderse
              </Button>
            )}

            {on_exchange && (
              <Button
                isLoading={exchangedSelect}
                colorScheme="whiteAlpha"
                data-testid="ACTION_BOX_SWAP_BTN"
                rightIcon={<GiSwitchWeapon />}
                onClick={() => {
                  setExchangeSelected(true);
                  swapCard();
                }}
                isDisabled={
                  cardSelectedID == undefined ||
                  cardSelected?.name == CardTypes.THETHING ||
                  (cardSelected?.name == CardTypes.INFECTED &&
                    player.role == PlayerRole.HUMAN)
                  // TODO: la condicion de abajo esta incompleta.
                  // tambien le falta que sea la unica carta de infectado en la mano
                  // || (cardSelected?.name == Card.INFECTED && player.role == PlayerRole.INFECTED)
                }
              >
                Intercambiar
                {turn}
              </Button>
            )}
          </Stack>
        </PopoverTrigger>
      </Popover>
    </Box>
  );
};

export default ActionBox;
