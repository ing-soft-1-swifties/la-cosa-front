import {
    SimpleGrid,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    Heading,
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
  const cardsToShow = gameState.dataCardPlayed.cardsToShow;
  const player = gameState.dataCardPlayed.player;


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
        <ModalContent maxW="800px" maxH="600px" bg="rgba(0, 0, 0, 0.8)" >
          <ModalCloseButton color="white" />
          <ModalBody>
          <Heading textAlign='center' mb = "15" color="white">El jugador {player} te mostro sus carta</Heading> {/* Title */}
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
           
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
  
export default ModalShowCards