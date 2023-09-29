import { Box, Flex } from "@chakra-ui/react";
import { relative } from "path";
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
