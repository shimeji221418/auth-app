import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        backgroundColor: "gray.100",
        color: "gray.700",
        fontFamily: "system-ui",
      },
    },
  },
});

export default theme;
