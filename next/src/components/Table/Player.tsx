import { Avatar, Box, Text } from '@chakra-ui/react'
import React from 'react'
import { GamePlayer } from '@/store/gameSlice'

const Player = ({ player, selected = false }: { player: GamePlayer, selected: boolean }) => {
  return (<>
    <Box 
      borderWidth="7px"
      borderRadius="lg"
      borderColor={selected ? "green.500" : "transparent"}
      key={player.name} transform="translateX(-50%) translateY(50%)" data-testid={`player`}>
      <Avatar/>
      <Text userSelect="none" color="white" textAlign="center">{player.name}</Text>
    </Box>
  </>)
}

export default Player
