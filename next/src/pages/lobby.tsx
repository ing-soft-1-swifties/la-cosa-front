import { PageWithLayout } from "@/src/pages/_app";
import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";

const Page: PageWithLayout = () => {
  return (
    <Flex flexDir="column" minH="100vh">
      <Box py={4}>
        <Text fontSize="5xl" fontWeight="bold" textAlign="center">Lobby #04</Text>
      </Box>
      <Flex flex="1" h="100%" bg="blue">
        <Box flexBasis="65%" bg="red">
          <Text fontSize="2xl" fontWeight="bold" textDecor="underline">
            Welcome to La Cosa
          </Text>
        </Box>
        <Box flex="1" bg="red.500">
          PT
        </Box>
      </Flex>
    </Flex>
  );
};

export default Page;
