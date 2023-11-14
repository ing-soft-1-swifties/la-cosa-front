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
  GiFireAxe,
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
  GamePlayer,
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
  const localPlayer = usePlayerGameState();
  const cardSelected = player.selections.card;
  const cardSelectedID = cardSelected?.id;
  const { turn, on_exchange, on_turn, state } = player;
  const playerSelected = player.selections.player;
  const doorSelected = player.selections.door;
  const on_defense = state == PlayerTurnState.DEFENDING;
  const have_axe: boolean = player.cards.some((card)=>{return card.name == GameCardTypes.AXE});
  const players_data = useSelector((state: RootState) => state.game.players);
  const gameState = useSelector((state: RootState) => state.game);
  const playerSelectedPublicData = gameState.players.find(
    (player: GamePlayer) => player.id == playerSelected
  );
  
  const lastPlayedCard = useSelector(
    (state: RootState) => state.game.lastPlayedCard
  );
  const {
    isOpen: isFinishOpen,
    onClose: finishOnClose,
    onOpen: finishOnOpen,
  } = useDisclosure();
  const leastDestructiveRef = useRef(null);

  function isNextToDoor() {
    const position = playerSelectedPublicData?.position;
    const rest = Math.abs(localPlayer.position - position!);
    const alivePlayersAmount = players_data.filter(
      (p) => p.status == PlayerStatus.ALIVE
    ).length;

    if(localPlayer.position == alivePlayersAmount && position == 0)
      return true;
    return localPlayer.position < position! && (localPlayer.position != 0 && position != alivePlayersAmount)
  }

  const playCard = () => {
    let cardOptions: any = {};
    
    if (playerSelected) cardOptions.target = playerSelected;
    if (player.card_picking_amount > 0)
      cardOptions.cards = player.multiSelect.away_selected;
  
    // control de la carta hacha
    if (player.selections.card?.name == GameCardTypes.AXE) {
      const isQuaratine = playerSelected != undefined;
      const target = doorSelected != undefined ? doorSelected : playerSelected;
      cardOptions = doorSelected
        ? { target: target, is_quaratine: isQuaratine }
        : {};
    }

    if (player.selections.card?.name == GameCardTypes.LOCKED_DOOR && isNextToDoor()) {
      cardOptions = {target: player.position}
    }

    if (cardSelectedID !== undefined) {
      sendPlayerPlayCard(cardSelectedID, cardOptions);
      dispatch(
        setMultiSelect({
          away_selected: [],
        })
      );
    }
  };

  // envia el hacha apuntandose a si mismo en modo quitar cuarentena
  const playCardKillQuarantine = () => {
    var cardOptions = { target: player.id, is_quaratine: true};
    if (cardSelectedID !== undefined) {
      sendPlayerPlayCard(cardSelectedID, cardOptions);
    }
  }

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
  if (cardSelected?.name === GameCardTypes.AXE  && !player.selections.player && !player.selections.door) {
    popoverText = "Selecciona una persona en cuarentena o una puerta, adyacentes.";
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

  let cannotPlaySelectedCard = // si no hay carta seleccionada
    cardSelectedID == undefined ||
    cardSelected?.name == GameCardTypes.THETHING ||
    cardSelected?.name == GameCardTypes.INFECTED ||
    cardSelected?.subType == CardSubTypes.DEFENSE ||
    (cardSelected?.name != GameCardTypes.AXE &&
      cardSelected?.needTarget &&
      player.selections.player == undefined) ||
    (cardSelected?.name == GameCardTypes.AXE &&
      player.selections.door == undefined &&
      player.selections.player == undefined);
  if (
    player.panicCards.length > 0 &&
    cardSelected != null &&
    cardSelected.type != CardTypes.PANIC
  )
    cannotPlaySelectedCard = true;

  return (
    <Box mx="5" maxW="70vh" pb={player.quarantine > 0 ? 10 : 4}>
      <VStack spacing={4} align="stretch">
        {player.quarantine > 0 && (
          <Box>
            <Alert status="error">
              <GiGasMask size={30} />
              <AlertTitle>Estas en cuarentena!</AlertTitle>
              <AlertDescription>
                Rondas restantes {player.quarantine}.
              </AlertDescription>
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
                    {have_axe && (
                      <Button
                        colorScheme="whiteAlpha"
                        data-testid="ACTION_BOX_PLAY_BTN"
                        onClick={playCardKillQuarantine}
                        rightIcon={<GiFireAxe />}
                        isDisabled={cardSelected?.name != GameCardTypes.AXE}
                      >
                        Quitar mi cuarentena
                      </Button>
                    )}

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
//cuando tenga una hacha en la mano el mensaje digha selecciona una persona en cuarentena o puerta adyasente