import { Box, Button, Card, CardBody, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import { } from "path";
import { FC, ReactElement, useState } from "react";

interface IProps {
    children: ReactElement;
}

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

export default function DefaultLayout() {

    const [lobbys, setlobbys] = useState([]);

    return (
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
    );
}

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

