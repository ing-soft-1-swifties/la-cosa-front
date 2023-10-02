import { PageWithLayout } from "@/src/pages/_app";
import { Button, Flex, Text } from "@chakra-ui/react";
import ModalPP from "@/src/components/modalCrearPartida";
import React, { use, useState } from "react";

const Page: PageWithLayout = () => {
  // let conteo = 0;
  // const [conteo, setConteo] = useState(0);

  return (
    <Flex h="100vh" justify="center" align="center">
      <Text fontSize="2xl" fontWeight="bold" textDecor="underline"></Text>
      {/* {conteo} */}
      {/* <Button
        onClick={() => {
          // conteo += 1;
          setConteo(conteo + 1)
          console.log("me clickeaste");
        }}
      >
        sumar uno
      </Button> */}
      <ModalPP/>
    </Flex>
  );
};

export default Page;
