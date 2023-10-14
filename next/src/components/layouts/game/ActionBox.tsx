import { Button, Stack } from "@chakra-ui/react";
import {} from "path";
import { FC } from "react";
import {
  GiBroadsword,
  GiFireShield,
  GiSwitchWeapon,
  GiChaliceDrops,
} from "react-icons/gi";
import { sendPlayerPlayCard } from "@/src/business/game/gameAPI/manager";
import usePlayerGameState from "hooks/usePlayerGameState";

type ActionBoxProps = {};

const ActionBox: FC<ActionBoxProps> = ({}) => {
  const player = usePlayerGameState();

  const playCard = () => {
    const cardSelected = player.selections.card;
    const playerSelected = player.selections.player;

    var cardOptions = playerSelected ? { target: playerSelected } : {};
    if (cardSelected !== undefined) {
      sendPlayerPlayCard(cardSelected, cardOptions);
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
        >
          Jugar
        </Button>
        {/* <Button colorScheme='whiteAlpha' rightIcon={<GiChaliceDrops />}>Descartar</Button> */}
        {/* <Button colorScheme='whiteAlpha' rightIcon={<GiFireShield />}>Defenderse</Button> */}
        {/* <Button colorScheme='whiteAlpha' rightIcon={<GiSwitchWeapon />}>Intercambiar</Button> */}
      </Stack>
    </>
  );
};

export default ActionBox;
