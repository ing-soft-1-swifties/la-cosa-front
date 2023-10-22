import { Button, Stack } from "@chakra-ui/react";
import { } from "path";
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
  const turn = player.turn;

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

  return (
    <>
      <Stack maxW="20vw" data-testid={`HAND`} justify="center">
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

        <Button
          colorScheme='whiteAlpha'
          data-testid="ACTION_BOX_DEFENSE_BTN"
          onClick={defenseCard}
          rightIcon={<GiFireShield />}
          isDisabled={cardSelectedID == undefined || cardSelected?.subType !==  CardSubTypes.DEFENSE}
        >Defenderse
        </Button>

        <Button
          colorScheme='whiteAlpha'
          data-testid="ACTION_BOX_SWAP_BTN"
          rightIcon={<GiSwitchWeapon />}
          onClick={swapCard}
          isDisabled={cardSelectedID == undefined || cardSelected?.name == Card.THETHING || (cardSelected?.name == Card.INFECTED && player.role == PlayerRole.INFECTED)}
        >Intercambiar
          {turn}</Button>
      </Stack>
    </>
  );
};

export default ActionBox;
