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
  Flex,
} from "@chakra-ui/react";
import { FC, useMemo } from "react";
import GameCard from "@/components/layouts/game/GameCard";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setCardsToShow } from "@/store/gameSlice";

type ModalShowCardProps = {};
const ModalShowCards: FC<ModalShowCardProps> = () => {
  const dispatch = useDispatch();
  const cardsToShow = useSelector(
    (state: RootState) => state.game.dataCardPlayed.cardsToShow
  );
  // const player = useSelector((state: RootState) => state.game.dataCardPlayed.player);
  const title = useSelector(
    (state: RootState) => state.game.dataCardPlayed.title
  );
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
            </Heading>
            {/* Title */}
            <Flex justify="center" align="center" columnGap={4}>
              {sortedCards.map(({ id, name }) => (
                <GameCard
                  maxW="25%"
                  gridColumnStart={0}
                  gridColumnEnd={5}
                  alignSelf="center"
                  justifySelf="center"
                  key={id}
                  name={name}
                  card_id={id}
                />
              ))}
            </Flex>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalShowCards;
