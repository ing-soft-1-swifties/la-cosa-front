import { Box, Text, Center, Flex, Grid, HStack, SimpleGrid, Button, Stack } from "@chakra-ui/react";
import { } from "path";
import { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import GameCard from "./GameCard";
import { GiBroadsword, GiFireShield, GiSwitchWeapon, GiChaliceDrops } from "react-icons/gi";
import GreyBG from '@/public/game/grey-back.jpg'
import BgImage from "@/components/utility/BgImage";
import { gameSocket } from "business/game/gameAPI";
import { sendPlayerPlayCard } from "business/game/gameAPI/manager";

type ActionBoxProps = {};

const ActionBox: FC<ActionBoxProps> = ({ }) => {
    const personalData = useSelector((state: RootState) => state.game.playerData);
    const cardsList = personalData.cards;

    return (
        <>
            <Stack bgColor='red' h='100%' maxW='20vw' data-testid={`HAND`} justify='center'>
                <Button colorScheme='whiteAlpha' data-testid='ACTION_BOX_PLAY_BTN' onClick={playCard} rightIcon={<GiBroadsword />} >Jugar</Button>
                {/* <Button colorScheme='whiteAlpha' rightIcon={<GiChaliceDrops />}>Descartar</Button> */}
                {/* <Button colorScheme='whiteAlpha' rightIcon={<GiFireShield />}>Defenderse</Button> */}
                {/* <Button colorScheme='whiteAlpha' rightIcon={<GiSwitchWeapon />}>Intercambiar</Button> */}
            </Stack>
        </>
    );
};

export default ActionBox;

const playCard = () => {
    const playerData = useSelector((state: RootState) => state.game.playerData);
    var cardSelected = playerData.cardSelected;
    var playerSelected = playerData.playerSelected;
    
    var cardOptions = playerSelected? {target: playerSelected} : {};
    if(cardSelected!==undefined) {
        sendPlayerPlayCard(cardSelected, cardOptions);
    }    
};
