import { PageWithLayout } from "@/src/pages/_app";
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    Card,
    CardBody,
    Container,
    Flex,
    Heading,
    Input,
    ScaleFade,
    Spacer,
    Text,
    VStack,
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import GreenForestBack from "@/public/home/GreenForestWall.jpg";


const LOBBYS = [
    {
        id: 1,
        count: 5,
        name: 'game1',
        max: 12,
    },
    {
        id: 2,
        count: 10,
        name: 'game2',
        max: 12,
    },
    {
        id: 3,
        count: 12,
        name: 'game3',
        max: 12,
    },
]



const shearLobby = (setShearingPerLobby: any) => {
}

const Page: PageWithLayout = () => {

    const [lobbys, setlobbys] = useState([]);
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
        <Box pos="relative" bg='green.900' >
            <Container maxW="100rem" >
                <Flex flexDir="column" minH="100vh" pt={5} pb={10} px={4}>

                    <Box py={4}>
                        <Heading as="h1" fontSize="5xl" fontWeight="bold" textAlign="center" color="white">
                            LA COSA
                        </Heading>
                    </Box>

                    <Flex flex="1" bg="rgba(70, 70, 70, 0.85)" borderRadius="3xl">
                        <Box flexBasis="65%" px={16} py={10}>
                            <Heading
                                as="h2"
                                mb={6}
                                textAlign="center"
                                textTransform="uppercase"
                                color="white"
                            >
                                PARTIDAS
                            </Heading>

                            <Flex
                                flexWrap="wrap"
                                rowGap={8}
                                justify="space-between"
                            >
                                {lobbys.map(({ id, name, count, max }) => {
                                    return (
                                        <Box key={id} flexBasis="100%">
                                            <GameCard id={id} name={name} count={count} max={max} />
                                        </Box>
                                    );
                                })}
                            </Flex>
                        </Box>
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

                                <ScaleFade initialScale={0.9} in={seeShearError} >
                                    <Alert
                                        status='error'
                                        variant='subtle'
                                        flexDirection='column'
                                        alignItems='center'
                                        justifyContent='center'
                                        textAlign='center'
                                        height='200px'
                                        display={seeShearError ? "flex" : 'none'}
                                        onClick={()=>{setSeeError(!seeShearError)}}
                                    >
                                        <AlertIcon boxSize='40px' mr={0} />
                                        {/* <AlertTitle mt={4} mb={1} fontSize='lg'>
                                            No es posible acceder a la partida
                                        </AlertTitle> */}
                                        <AlertDescription maxWidth='sm'>
                                            No se pudo acceder a la partida, posiblemente no existe o esta llena o ya esta iniciada. Por favor ingresar un numero de partida valido
                                        </AlertDescription>
                                    </Alert>
                                </ScaleFade>
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

type GameCardProps = {
    id: number;
    name: string;
    count: number;
    max: number;
};

const GameCard: FC<GameCardProps> = ({ id, name, count, max }, shearingPerLobby) => {
    return (
        <Card pl={6}>
            <CardBody>
                <Flex alignItems='center'>
                    <Text fontSize="2xl" fontWeight="bold" textAlign="center">
                        {name}
                    </Text>
                    <Text fontSize="2xl" color='gray.300' pl={2}>#{id}</Text>
                    <Spacer />
                    <Flex columnGap={3} alignItems='center' >
                        <Box borderWidth='1px' borderRadius='lg' p={2} verticalAlign='center' color='gray.800'>
                            <Text>{count}/{max}</Text>
                        </Box>
                        <Button variant='outline' isDisabled={(count == max) && shearingPerLobby}>Entrar</Button>
                    </Flex>
                </Flex>
            </CardBody>
        </Card>
    );
};

export default Page;