import { Alert, AlertDescription, AlertIcon, Box, Button, Card, CardBody, Flex, Heading, ScaleFade, Spacer, Text } from "@chakra-ui/react";
import { } from "path";
import { Dispatch, SetStateAction, useState } from "react";

interface IProps {
    seeShearError: boolean;
    setSeeError: Dispatch<SetStateAction<boolean>>;
}

export default function DefaultLayout({seeShearError,setSeeError}: IProps) {
    return (
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
        
    );
}