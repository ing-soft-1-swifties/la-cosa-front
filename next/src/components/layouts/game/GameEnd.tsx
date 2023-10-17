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
import { PlayerRole } from "store/gameSlice";

type GameEndData = {
  winner_team: string;
  roles: [string, string][]; // name & role
};

type GameEndProps = {};
const GameEnd: FC<GameEndProps> = () => {
  const router = useRouter();
  const [gameEndData, setGameEndData] = useState<GameEndData | undefined>(
    undefined
  );
  const handleGameEnd = (data: GameEndData) => {
    setGameEndData(data);
  };
  useEffect(() => {
    gameSocket.on(EventType.ON_GAME_END, handleGameEnd);
    return () => {
      gameSocket.off(EventType.ON_GAME_END, handleGameEnd);
    };
  });

  const theThing = gameEndData?.roles.filter(
    ([_, role]) => role == PlayerRole.THETHING
  );
  const infected = gameEndData?.roles.filter(
    ([_, role]) => role == PlayerRole.INFECTED
  );
  const humans = gameEndData?.roles.filter(
    ([_, role]) => role == PlayerRole.HUMAN
  );

  if (gameEndData) {
    return (
      <Box data-testid="gameend">
        <Modal isOpen={true} onClose={() => {}} size="2xl">
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
                  <Text
                    fontSize="xl"
                    textAlign="center"
                    mb="4"
                    fontWeight="bold"
                  >
                    Ganador:
                  </Text>
                  <Text fontSize="xl" textAlign="center" mb="8">
                    {gameEndData.winner_team}
                  </Text>
                  <Text
                    fontSize="xl"
                    textAlign="center"
                    fontWeight="bold"
                    mb="5"
                  >
                    Roles Finales:
                  </Text>
                  {theThing?.map(([name, role]) => {
                    return (
                      <Text key={name}>
                        {name}:{' '}
                        <Text as="span" color="red.500" fontWeight="bold">
                          LA COSA
                        </Text>
                      </Text>
                    );
                  })}

                  {infected?.map(([name, role]) => {
                    return (
                      <Text key={name}>
                        {name}:{' '}
                        <Text as="span" color="green.600" fontWeight="bold">
                          INFECTADO
                        </Text>
                      </Text>
                    );
                  })}

                  {humans?.map(([name, role]) => {
                    return (
                      <Text key={name}>
                        {name}:{' '}
                        <Text as="span" color="blue.600" fontWeight="bold">
                          HUMANO
                        </Text>
                      </Text>
                    );
                  })}
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
  }

  return <></>;
};

export default GameEnd;
