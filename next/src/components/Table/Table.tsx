import { Box } from '@chakra-ui/react'
import React, { FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectPlayer, unselectPlayer } from '@/store/gameSlice'
import { RootState } from '@/store/store'
import Player from './Player'

type TableProps = {}

function getTranslatesForPosition(position: number, playerAmount: number): { x: number, y: number } {
  // Obtenemos el angulo para la posicion del jugador
  let angle = position * ((2 * Math.PI) / playerAmount);
  angle -= Math.PI / 2

  // Devolvemos sus coordenadas en el círculo trigonométrico
  return { x: Math.cos(angle), y: Math.sin(angle) };
}

const Table: FC<TableProps> = () => {
  const players = useSelector((state: RootState) => state.game.players.filter(p => p.id !== state.game.playerData.playerID))
  // const players = useSelector((state: RootState) => state.game.players)
  const localPlayer = useSelector((state: RootState) => state.game.players.find(p => p.id === state.game.playerData.playerID))
  const selectedPlayerID = useSelector((state: RootState) => state.game.playerData.playerSelected);

  const dispatch = useDispatch();

  if (localPlayer == undefined) {
    throw new Error("No player in the game has this player's id!")
  }

  function onPlayerSelectedToggle(playerID: number) {
    if (selectedPlayerID === playerID) {
      dispatch(unselectPlayer());
    } else {
      dispatch(selectPlayer(playerID));
    }
  }

  return (
    <Box
      m="auto"
      width="40%"
      p="70px"
      mt="10vh"
    >
      <Box
        borderWidth="1px"
        width="100%"
        borderColor="gray"
        borderRadius="100%"
        aspectRatio="1"
        display="flex"
        justifyContent="center"
        alignItems="center"
        position="relative">
        {players.map(player => {
          const { x, y } = getTranslatesForPosition(player.position - (localPlayer.position as any), players.length + 1)
          return (
            <Box
              key={player.name}
              position="absolute"
              left={`calc(50% + ${x * 62}%)`}
              bottom={`calc(50% + ${y * 62}%)`}
              onClick={() => onPlayerSelectedToggle(player.id)}
            >
              <Player
                player={player}
                selected={player.id === selectedPlayerID}
              />
            </Box>
          )
        }
        )}
      </Box>

    </Box>
  )
}

export default Table;
