// deklarowanie modulow typescriptowych https://www.totaltypescript.com/books/total-typescript-essentials/modules-scripts-and-declaration-files

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as Mui from "@mui/material";

declare module "@mui/material/styles" {
  interface Palette {
    tertiary: Palette["primary"];
  }

  interface PaletteOptions {
    tertiary?: PaletteOptions["primary"];
  }
}
