import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Box,
  Text,
  Flex,
  Button,
} from "@chakra-ui/react";
import { gameSocket } from "@/src/business/game/gameAPI";
import React, { FC, useEffect, useState } from "react";
import { EventType } from "@/src/business/game/gameAPI/listener";
import { useRouter } from "next/router";
import { finishGame } from "@/src/business/game/gameAPI/manager";

type GameEndProps = {};

const GameEnd: FC<GameEndProps> = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const handleGameEnd = () => {
    setShowModal(true);
  };
  useEffect(() => {
    gameSocket.on(EventType.ON_GAME_END, handleGameEnd);
    return () => {
      gameSocket.off(EventType.ON_GAME_END, handleGameEnd);
    };
  });
  return (
    <Box data-testid="gameend">
      <Modal isOpen={showModal} onClose={() => {}} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pt="10">
            <Text
              textAlign="center"
              fontWeight="bold"
              color="green.600"
              fontSize="3xl"
            >
              La partida finalizo!
            </Text>
          </ModalHeader>
          <ModalBody>
            <Flex justify="center" align="center" mb="10">
              <Box>
                <Text fontSize="xl" textAlign="center" mb="4" fontWeight="bold">
                  Ganador:
                </Text>
                <Text fontSize="xl" textAlign="center" mb="8">
                  Milei
                </Text>
                <Text fontSize="xl" textAlign="center" fontWeight="bold" mb="5">
                  Roles Iniciales:
                </Text>
                <Text>
                  PEPITO:{" "}
                  <Text as="span" color="red.500" fontWeight="bold">
                    LA COSA
                  </Text>
                </Text>
                <Text>
                  PEPITO:{" "}
                  <Text as="span" color="green.600" fontWeight="bold">
                    INFECTADO
                  </Text>
                </Text>
                <Text>
                  PEPITO:{" "}
                  <Text as="span" color="blue.600" fontWeight="bold">
                    HUMANO
                  </Text>
                </Text>
                <Flex justify="center" mt="12">
                  <Button
                    colorScheme="green"
                    onClick={() => {
                      finishGame();
                    }}
                  >
                    Volver al Menu Principal
                  </Button>
                </Flex>
              </Box>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default GameEnd;
