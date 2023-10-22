import { Box, BoxProps } from "@chakra-ui/react";
import Image, { ImageProps } from "next/image";
import { CSSProperties, FC } from "react";

type BgImageProps = BoxProps & {
  imageProps: ImageProps;
  styles?: CSSProperties;
};

const BgImage: FC<BgImageProps> = ({ imageProps, styles, ...props }) => {
  return ( // Crea una imagen de fondo
    <Box pos="absolute" h="full" zIndex={-10} {...props}>
      <Image
        style={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
          objectPosition: "50% 50%",
          ...styles,
        }}
        {...imageProps}
        alt={imageProps.alt}
      />
    </Box>
  );
};

export default BgImage;