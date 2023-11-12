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

type ModalShowCardProps = {};
const ModalShowCards: FC<ModalShowCardProps> = () => {
  const gameState = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();
  const cardsToShow = gameState.dataCardPlayed.cardsToShow;
  const player = gameState.dataCardPlayed.player;
  const title = gameState.dataCardPlayed.title

  const sortedCards = useMemo(
    () => [...(cardsToShow ?? [])].sort((c1, c2) => c1.id - c2.id),
    [cardsToShow]
  );

  const onModalClose = () => {
    dispatch(
      setCardsToShow({
        cardsToShow: undefined,
        player: undefined,
        title: undefined,
      })
    );
  };

  return (
    <>
      <Modal
        isCentered
        onClose={onModalClose}
        isOpen={cardsToShow != undefined}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent
          maxW="800px"
          maxH="600px"
          bg="rgba(0, 0, 0, 0.8)"
          px="5"
          pb="5"
          pt="8"
        >
          <ModalCloseButton color="white" size="xl" mr="2" mt="2" />
          <ModalBody>
            <Heading textAlign="center" mb="10" color="white">
              {title}
            </Heading>{" "}
            {/* Title */}
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
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalShowCards;
