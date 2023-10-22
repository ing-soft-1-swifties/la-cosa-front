import { Button, Stack } from "@chakra-ui/react";
import { } from "path";
import { FC } from "react";
import {
  GiBroadsword,
  GiFireShield,
  GiSwitchWeapon,
  GiChaliceDrops,
} from "react-icons/gi";
import { sendPlayerDiscardCard, sendPlayerPlayCard, sendPlayerSelectExchangeCard } from "@/src/business/game/gameAPI/manager";
import usePlayerGameState from "@/src/hooks/usePlayerGameState";
import { PlayerStatus, PlayerTurnState } from "@/store/gameSlice";

type ActionBoxProps = {};

const ActionBox: FC<ActionBoxProps> = ({ }) => { // Caja de acciones del jugador
  //obtengo el estado del jugador,las cartas seleccionadas y el turno
  const player = usePlayerGameState();
  const cardSelected = player.selections.card;  
  const turn = player.turn;

  const playCard = () => { // Funcion para jugar una carta
    const playerSelected = player.selections.player;

    var cardOptions = playerSelected ? { target: playerSelected } : {}; //cardOptions es un objeto que contiene el target del jugador seleccionado
    if (cardSelected !== undefined) { 
      sendPlayerPlayCard(cardSelected, cardOptions); // Envia al servidor el evento de que el jugador jugo una carta
    }
  };

  const discardCard = () => {  // Funcion para descartar una carta
    if (cardSelected !== undefined) { 
      sendPlayerDiscardCard(cardSelected); 
    }
  };

  const swapCard = () => { // Funcion para intercambiar una carta
    if (cardSelected !== undefined) {
      sendPlayerSelectExchangeCard(cardSelected);
    }
  };
  if (player.status == PlayerStatus.DEATH) { // Si el jugador esta muerto, retorna null
    return null;
  }

  return (// Crea un stack con las acciones del jugador
    <>
      <Stack maxW="20vw" data-testid={`HAND`} justify="center"> 
        <Button
          colorScheme="whiteAlpha" 
          data-testid="ACTION_BOX_PLAY_BTN"
          onClick={playCard} 
          rightIcon={<GiBroadsword />}
          isDisabled={cardSelected == undefined && turn !== PlayerTurnState.PLAY_OR_DISCARD}
        >Jugar
        </Button>

        <Button
          colorScheme='whiteAlpha'
          data-testid="ACTION_BOX_DSC_BTN"
          rightIcon={<GiChaliceDrops />}
          onClick={discardCard}
          isDisabled={cardSelected == undefined && turn !== PlayerTurnState.PLAY_OR_DISCARD}
        >Descartar
        </Button>
        {/* <Button colorScheme='whiteAlpha' rightIcon={<GiFireShield />}>Defenderse</Button> */}
        <Button
          colorScheme='whiteAlpha'
          data-testid="ACTION_BOX_SWAP_BTN"
          rightIcon={<GiSwitchWeapon />}
          onClick={swapCard}
          isDisabled={cardSelected == undefined && turn !== PlayerTurnState.SELECT_EXCHANGE_CARD}
        >Intercambiar
        {turn}</Button>
      </Stack>
    </>
  );
};

export default ActionBox;
