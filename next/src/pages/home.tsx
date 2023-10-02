import { PageWithLayout } from "@/src/pages/_app";
import {
    Alert,
    AlertDescription,
    AlertIcon,
    Box,
    Button,
    Container,
    Flex,
    Heading,
    Input,
    ScaleFade,
    Text,
    
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import GreenForestBack from "@/public/home/GreenForestWall.jpg";
import GameList from "components/layouts/home/GameList";
import GameAlert from "components/layouts/home/GameAlert";
import BgImage from "components/utility/BgImage";


const Page: PageWithLayout = () => {

    const [shearingPerLobby, setShearingPerLobby] = useState(false);
    const [seeShearError, setSeeError] = useState(false);

    useEffect(() => {
    }, [shearingPerLobby]);

    // query para comprobar que la partida a la que me voy a unir puedo entrar
    const shearLobby = () => {
        setShearingPerLobby(true);
        //si la partida es invalida
        if(true)setSeeError(true);
    };
    //se que lo vamos a hacer con querys de redux pero bueno es para ir viendo

    return (
        <Box pos="relative" >
            <BgImage imageProps={{
                src: GreenForestBack,
                alt: '' 
            }}/>
            <Container maxW="100rem" >
                <Flex flexDir="column" minH="100vh" pt={5} pb={10} px={4}>

                    <Box py={4}>
                        <Heading as="h1" fontSize="5xl" fontWeight="bold" textAlign="center" color="white">
                            LA COSA
                        </Heading>
                    </Box>

                    <Flex flex="1" bg="rgba(70, 70, 70, 0.85)" borderRadius="3xl">
                        
                        <GameList/>
                        
                        <Box
                            flex="1"
                            bg="rgba(30, 30, 30, 0.7)"
                            borderTopRightRadius="3xl"
                            borderBottomRightRadius="3xl"
                            pt={24}
                            pb={10}
                        >
                            <Flex p={3} rowGap={4} justifyContent='center' flexWrap="wrap" columnGap={6} justify="space-between">

                                <Box minW='100%' border='4px' borderColor='white' borderRadius='2xl' p={4} >
                                    <Text textAlign="center" pb={4} fontSize='3xl' color ='white'> Partidas personalizadas</Text>
                                    <Flex columnGap={3}>
                                        <Input variant='filled' placeholder='ID Partida' />
                                        <Button isLoading={shearingPerLobby} pl={8} pr={8} onClick={shearLobby}>Unirse Partida</Button>
                                    </Flex>
                                </Box>

                                <GameAlert seeShearError={seeShearError} setSeeError={setSeeError}/>

                                <Box>
                                    <Button color='green' >Crear Partida</Button>
                                </Box>

                            </Flex>
                        </Box>
                    </Flex>
                </Flex>
            </Container>
        </Box>

    );
};


export default Page;