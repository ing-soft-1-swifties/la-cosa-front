import { initGameSocket, isSocketUpToDate } from "@/src/business/game/gameAPI";
import { useRouter } from "next/router";
import { FC, ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/store";

type GameAuthHandlerProps = {
  children: ReactNode;
};

const GameAuthHandler: FC<GameAuthHandlerProps> = ({ children }) => {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.user.gameConnToken);

  useEffect(() => {
    if (token == null) router.replace("/");
  }, [token, router]);
  if (token == null) return <></>;

  // Iniciamos el Socket con la autentificacion si el socket esta desactualizado.
  if (!isSocketUpToDate()) initGameSocket();

  return <>{children}</>;
};

export default GameAuthHandler;
