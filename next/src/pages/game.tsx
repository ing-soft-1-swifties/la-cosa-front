import { PageWithLayout } from "@/src/pages/_app";
import { Box } from "@chakra-ui/react";

const Page: PageWithLayout = () => {
  return <Box pos="relative">El juego!</Box>;
};

Page.authConfig = {
  gameAuthProtected: true,
};

export default Page;
