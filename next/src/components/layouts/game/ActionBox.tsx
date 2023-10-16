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
import { PlayerTurnState } from "@/store/gameSlice";

type ActionBoxProps = {};

const ActionBox: FC<ActionBoxProps> = ({ }) => {
  const player = usePlayerGameState();
  const cardSelected = player.selections.card;
  const turn = player.turn;

  const playCard = () => {
    const playerSelected = player.selections.player;

    var cardOptions = playerSelected ? { target: playerSelected } : {};
    if (cardSelected !== undefined) {
      sendPlayerPlayCard(cardSelected, cardOptions);
    }
  };

  const discardCard = () => {
    if (cardSelected !== undefined) {
      sendPlayerDiscardCard(cardSelected);
    }
  };

  const swapCard = () => {
    if (cardSelected !== undefined) {
      sendPlayerSelectExchangeCard(cardSelected);
    }
  };

  return (
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
