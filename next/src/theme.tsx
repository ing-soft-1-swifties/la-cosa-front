import { extendTheme } from "@chakra-ui/react";
import { Kalam} from "next/font/google";

const KalamFont = Kalam({ 
  weight: ["300", "400", "700"],
  subsets: [],
});
export const KalamFontFamily = KalamFont.style.fontFamily;

const SiteTheme = extendTheme({
  fonts: {
    heading: KalamFontFamily,
    body: KalamFontFamily
  },
});

export default SiteTheme;
