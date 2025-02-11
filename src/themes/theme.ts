import { createTheme, PaletteColorOptions } from "@mui/material";
import { purple } from "@mui/material/colors";

// export { default as amber } from './amber';
// export { default as blue } from './blue';
// export { default as blueGrey } from './blueGrey';
// export { default as brown } from './brown';
// export { default as common } from './common';
// export { default as cyan } from './cyan';
// export { default as deepOrange } from './deepOrange';
// export { default as deepPurple } from './deepPurple';
// export { default as green } from './green';
// export { default as grey } from './grey';
// export { default as indigo } from './indigo';
// export { default as lightBlue } from './lightBlue';
// export { default as lightGreen } from './lightGreen';
// export { default as lime } from './lime';
// export { default as orange } from './orange';
// export { default as pink } from './pink';
// export { default as purple } from './purple';
// export { default as red } from './red';
// export { default as teal } from './teal';
// export { default as yellow } from './yellow';

// deklarowanie modulow typescriptowych https://www.totaltypescript.com/books/total-typescript-essentials/modules-scripts-and-declaration-files
declare module "@mui/material/styles" {
  interface Palette {
    third?: PaletteColorOptions;
  }
  interface PaletteOptions {
    third?: PaletteColorOptions;
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: purple[500], // tutaj powinien byc twoj fioletowy
      light: purple[300], // 1-2 odcienie jasniejszy
      dark: purple[700], // 1-2 odcienie ciemniejszy
      contrastText: "#fff", // np dla fioletu bialy
    },
    secondary: {
      main: "#1c1c1c", //kolor dodatkowy
      light: "#333333", // 1-2 odcienie jasniejszy
      dark: "#444444", // 1-2 odcienie ciemniejszy
      contrastText: "#F7F5F2", // kontrastowy
    },
    grey: {
      // te odcienie szarosci masz po to, zeby ich uzywac
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#eeeeee",
      300: "#e0e0e0",
      400: "#bdbdbd",
      500: "#9e9e9e",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
    },
    text: {
      primary: "#f2f2f2",
      secondary: "#F7F5F2",
      disabled: "#bdbdbd",
    },
    background: {
      default: "#222222", // tu tez zdefiniuj wartosci
      paper: "#22222",
    },
  },
  shape: {
    borderRadius: 8, // defaultowy border radius dla komponentow, nie powinnismy uzywac innych; wyjatkiem jest borderRadius 100, kiedy chcemy zrobic kolko
  },
  typography: {
    fontFamily: "'Arial'",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "2.2rem",
    },
    button: {
      fontSize: "0.875rem",
      fontWeight: 500,
      textTransform: "uppercase",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 16px",
          width: "auto",
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        variant: "body1",
        color: "text.primary",
      },
      styleOverrides: {
        body1: {
          lineHeight: 1.6,
        },
        caption: {
          color: "text.secondary",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {},
    },
  },
});
