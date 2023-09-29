import { Box, Flex } from "@chakra-ui/react";
<<<<<<< HEAD
import {  } from "path";
=======
import { relative } from "path";
>>>>>>> pagina inicial esperando querys de redux
import { ReactElement } from "react";

interface IProps {
  children: ReactElement;
}

export default function DefaultLayout({ children }: IProps) {
  return (
    <Box position='relative'>
        <Flex>
            
        </Flex>
    </Box>
  );
}
