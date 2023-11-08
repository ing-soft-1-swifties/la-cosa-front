import { chakra } from "@chakra-ui/react";
import { motion, isValidMotionProp } from "framer-motion";

export const FramerMotionBox = chakra(motion.div, {
  shouldForwardProp: (prop) => {
    return prop == "children" || isValidMotionProp(prop);
  },
});
