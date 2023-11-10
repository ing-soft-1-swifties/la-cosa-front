import {
    SimpleGrid,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
  } from "@chakra-ui/react";
  import { FC, useMemo } from "react";
  import GameCard from "@/components/layouts/game/GameCard";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setCardsToShow } from "@/store/gameSlice";

type ModalShowCardProps = {}
const ModalShowCards: FC<ModalShowCardProps> = () => {
  const gameState = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch()
  const cardsToShow = gameState.cardsToShow;


  const sortedCards = useMemo(
    () => [...(cardsToShow ?? [])].sort((c1, c2) => c1.id - c2.id),
    [cardsToShow]
  );

  const onModalClose = () => {
    dispatch(setCardsToShow(undefined))
  }

  return (
    <>
      
      <Modal
        isCentered
        
        onClose={onModalClose}
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
            <Button colorScheme="blue" mr={3} onClick={onModalClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
  
export default ModalShowCards