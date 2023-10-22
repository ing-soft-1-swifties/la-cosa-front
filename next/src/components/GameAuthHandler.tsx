import { initGameSocket, isSocketUpToDate } from "@/src/business/game/gameAPI";
import { Box, Portal, Text } from "@chakra-ui/react";
import useGameSocket from "@/src/hooks/useGameSocket";
import { useRouter } from "next/router";
import { FC, ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

type GameAuthHandlerProps = {
  children: ReactNode;
};

const GameAuthHandler: FC<GameAuthHandlerProps> = ({ children }) => { // Componente de la autentificación del juego
  const router = useRouter();
  const token = useSelector((state: RootState) => state.user.gameConnToken);
  const { isConnected } = useGameSocket();

  useEffect(() => {
    if (token == null) router.replace("/");
  }, [token, router]);
  if (token == null) return <></>;

  // Iniciamos el Socket con la autentificacion si el socket esta desactualizado.
  if (!isSocketUpToDate()) initGameSocket();

  return ( // Retorna un portal con el estado de la conexion
    <>
      {children}
      <Portal>
        <Box
          pos="fixed"
          right="0"
          bottom="0"
          bg="white"
          px="4"
          py="1"
          borderTopLeftRadius="xl"
        >
          <Text color={isConnected ? "green.600" : "red.600"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Text>
        </Box>
      </Portal>
    </>
  );
};

export default GameAuthHandler;
