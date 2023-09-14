import { PageWithLayout } from "@/src/pages/_app";
import { Flex, Text } from "@chakra-ui/react";


const Page: PageWithLayout = () => {
  return <Flex h="100vh" justify="center" align="center">
    <Text fontSize="2xl" fontWeight="bold" textDecor="underline">
      Welcome to La Cosa
    </Text>
  </Flex>
};

export default Page;