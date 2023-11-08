import {default as NextImage} from "next/image";
import { chakra } from "@chakra-ui/react";

const NextImageUsedProps = ["height", "width", "quality", "src", "alt", "title", "priority", "placeholder", "data-testid"];

const Image = chakra(NextImage, {
  shouldForwardProp: (prop) => NextImageUsedProps.includes(prop),
});

export default Image;
