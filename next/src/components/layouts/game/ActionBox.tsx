import {
  Button,
  Text,
  Popover,
  PopoverBody,
  Stack,
  VStack,
  StackDivider,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  Box,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Card,
  CardHeader,
  Heading,
  CardBody,
  useDisclosure,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { FC, useEffect, useRef, useState } from "react";
import {
  GiBroadsword,
  GiFireShield,
  GiDeathSkull,
  GiSwitchWeapon,
  GiChaliceDrops,
  GiSharpedTeethSkull,
  GiGasMask,
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
  CardTypes,
  PlayerRole,
  PlayerStatus,
  PlayerTurnState,
  setMultiSelect,
} from "@/store/gameSlice";
import { CardTypes as GameCardTypes } from "./GameCard";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import { gameSocket } from "@/src/business/game/gameAPI";
import { EventType } from "@/src/business/game/gameAPI/listener";

type ActionBoxProps = {};

const ActionBox: FC<ActionBoxProps> = ({}) => {
  const player = usePlayerGameState();
  const dispatch = useDispatch();
  const cardSelected = player.selections.card;
  const cardSelectedID = cardSelected?.id;
  const { turn, on_exchange, on_turn, state } = player;
  const playerSelected = player.selections.player;
  const on_defense = state == PlayerTurnState.DEFENDING;
  const lastPlayedCard = useSelector(
    (state: RootState) => state.game.lastPlayedCard
  );
  const {
    isOpen: isFinishOpen,
    onClose: finishOnClose,
    onOpen: finishOnOpen,
  } = useDisclosure();
  const leastDestructiveRef = useRef(null);

  const playCard = () => {
    let cardOptions: any = {};
    if (playerSelected) cardOptions.target = playerSelected;
    if (player.card_picking_amount > 0)
      cardOptions.cards = player.multiSelect.away_selected;
    if (cardSelectedID !== undefined) {
      sendPlayerPlayCard(cardSelectedID, cardOptions);
      dispatch(
        setMultiSelect({
          away_selected: [],
        })
      );
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
    sendPlayerPlayNoDefense();
  };

  const [exchangedSelect, setExchangeSelected] = useState(false);

  useEffect(() => {
    const callback = () => {
      setExchangeSelected(false);
    };
    gameSocket.on(EventType.ON_GAME_BEGIN_EXCHANGE, callback);
    return () => {
      gameSocket.off(EventType.ON_GAME_BEGIN_EXCHANGE, callback);
    };
  }, [setExchangeSelected]);

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
    popoverText =
      "Elije una carta para intercambiar o para defenderte del el otro jugador.";
  } else if (on_defense) {
    popoverTitle = "Te estan atacando!";
    popoverText = "Elije una carta para defenderte o no te podras defender.";
  }

  function selectMessageText() {
    if (cardSelected == undefined) {
      return "Seleccione una carta para jugar o descartar";
    }
    if (cardSelected.targetAdjacentOnly && playerSelected == undefined) {
      return "La carta seleccionada necesita un objetivo adyacente";
    }
    if (cardSelected?.needTarget && playerSelected == undefined) {
      return "La carta seleccionada necesita un objetivo";
    }
    if (cardSelected.subType == CardSubTypes.DEFENSE) {
      return "Las cartas de defensa solo se pueden descartar";
    }
    if (cardSelected?.name == GameCardTypes.THETHING) {
      return "La carta seleccionada no se puede jugar o descartar";
    }
    return "Seleccione la acción a realizar";
  }

  function canUseDefensCard() {
    if (cardSelected != undefined && lastPlayedCard != undefined) {
      return (
        (cardSelected.name == GameCardTypes.NOBBQ &&
          lastPlayedCard.card_name == GameCardTypes.FLAMETHROWER) ||
        (cardSelected.name == GameCardTypes.IM_FINE_HERE &&
          lastPlayedCard.card_name ==
            (GameCardTypes.YOU_BETTER_RUN || GameCardTypes.CHANGE_OF_LOCATION))
      );
    } else {
      return false;
    }
  }

  if (exchangedSelect && !on_exchange) {
    setExchangeSelected(false);
  }

  let cannotPlaySelectedCard =
    cardSelectedID == undefined ||
    cardSelected?.name == GameCardTypes.THETHING ||
    cardSelected?.name == GameCardTypes.INFECTED ||
    cardSelected?.subType == CardSubTypes.DEFENSE ||
    (cardSelected?.needTarget && player.selections.player == undefined);

  if ((player.state = PlayerTurnState.PANICKING)) {
    cannotPlaySelectedCard = cardSelected?.type != CardTypes.PANIC;
    if (
      player.card_picking_amount > 0 &&
      player.multiSelect.away_selected.length < player.card_picking_amount
    )
      cannotPlaySelectedCard = true;
  }

  return (
    <Box mx="5" maxW="70vh" pb={4}>
      <VStack spacing={4} align="stretch">
        {player.quarantine > 0 && (
          <Box>
            <Alert status="error">
              <GiGasMask size={30} />
              <AlertTitle>Estas en cuarentena!</AlertTitle>
              <AlertDescription>Rondas restantes {player.quarantine}.</AlertDescription>
            </Alert>
          </Box>
        )}
        <Box>
          <Card
            size="sm"
            bg="rgba(0, 0, 0, 0.4)"
            color="white"
            borderWidth="1px"
            borderColor="gray"
          >
            <CardHeader>
              <Heading size="md" borderColor="gray">
                {popoverTitle}
              </Heading>
            </CardHeader>

            <CardBody>{popoverText}</CardBody>
            <CardBody>
              <Stack data-testid={`HAND`} justify="center">
                {on_turn && !on_exchange && (
                  <>
                    <Button
                      colorScheme="whiteAlpha"
                      data-testid="ACTION_BOX_PLAY_BTN"
                      onClick={playCard}
                      rightIcon={<GiBroadsword />}
                      isDisabled={cannotPlaySelectedCard}
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
                        cardSelected?.name == GameCardTypes.THETHING
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
                    onClick={on_defense ? defenseCard : defenseCardOnExchange}
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
                {on_defense && (
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
                      cardSelected?.name == GameCardTypes.THETHING ||
                      (cardSelected?.name == GameCardTypes.INFECTED &&
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
                {player.role == PlayerRole.THETHING && (
                  <>
                    <Button
                      mt="6"
                      colorScheme="red"
                      data-testid="ACTION_BOX_THETHING_END_BTN"
                      onClick={finishOnOpen}
                      rightIcon={<GiSharpedTeethSkull />}
                    >
                      Finalizar
                    </Button>
                    <AlertDialog
                      leastDestructiveRef={leastDestructiveRef}
                      isOpen={isFinishOpen}
                      onClose={finishOnClose}
                    >
                      <AlertDialogOverlay>
                        <AlertDialogContent pb="7" pt="5">
                          <AlertDialogHeader
                            fontSize="xl"
                            fontWeight="bold"
                            textAlign="center"
                          >
                            Declarar Infeccion Global
                          </AlertDialogHeader>

                          <AlertDialogBody>
                            <Text textAlign="center" fontWeight="500">
                              Estas seguro? Si no estan todos los jugadores
                              infectados perderas!
                            </Text>
                          </AlertDialogBody>

                          <AlertDialogFooter justifyContent="center">
                            <Button
                              ref={leastDestructiveRef}
                              onClick={finishOnClose}
                            >
                              Cancelar
                            </Button>
                            <Button
                              colorScheme="red"
                              onClick={() => {
                                finishOnClose();
                                sendFinishGame();
                              }}
                              ml={3}
                            >
                              Aceptar
                            </Button>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialogOverlay>
                    </AlertDialog>
                  </>
                )}
              </Stack>
            </CardBody>
          </Card>
        </Box>
      </VStack>
    </Box>
  );
};

export default ActionBox;
