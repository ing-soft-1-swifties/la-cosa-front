import { Avatar, Box, Text } from '@chakra-ui/react'
import React, { Component } from 'react'
import { GamePlayer } from 'store/gameSlice'

const Player = ({ player }: { player: GamePlayer }) => {
  return (<>
    <Box key={player.name} transform="translateX(-50%) translateY(50%)">
      <Avatar/>
      <Text textAlign="center">{player.name}</Text>
    </Box>
  </>)
}

export default Player
