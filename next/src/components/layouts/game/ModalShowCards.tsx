import {
    SimpleGrid,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
  } from "@chakra-ui/react";
  import usePlayerGameState from "hooks/usePlayerGameState";
  import { useMemo } from "react";
  import GameCard from "@/components/layouts/game/GameCard";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import { setCardsToShow } from "store/gameSlice";

  function TransitionExample() {
    const player = usePlayerGameState();
    const gameState = useSelector((state: RootState) => state.game);
    const dispatch = useDispatch()
    let cardsToShow = gameState.cardsToShow;


    const sortedCards = useMemo(
      () => [...player.cards].sort((c1, c2) => c1.id - c2.id),
      [player.cards]
    );
  
    function setCardShow(undefined: undefined): import("react").MouseEventHandler<HTMLButtonElement> | undefined {
      throw new Error("Function not implemented.");
    }

    return (
      <>
       
        <Modal
          isCentered
          
          onClose={() => {
            dispatch(setCardsToShow(undefined))
          }}
          isOpen={cardsToShow != undefined}
          motionPreset="slideInBottom"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              <SimpleGrid columns={4} spacing={4}>  
                {sortedCards.map(({ id, name }) => (
                <GameCard
                alignSelf="stretch"
                key={id}
                name={name}
                card_id={id}
              />
                ))}
              </SimpleGrid>
            </ModalBody>
            <ModalFooter>
              {<Button colorScheme="blue" mr={3} onClick={setCardShow(undefined)}>
                Close
              </Button> }
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }
  