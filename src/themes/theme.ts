import { createTheme } from "@mui/material";

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

export const theme = createTheme({
  palette: {
    primary: {
      main: "#333333", //szary
      light: "#474747", // 1-2 odcienie jasniejszy
      dark: "#1f1f1f", // 1-2 odcienie ciemniejszy
      contrastText: "#F7F5F2", // np dla fioletu bialy
    },
    secondary: {
      main: "#690DAD", //fioletowy
      light: "#8010D1", // 1-2 odcienie jasniejszy
      dark: "#520A85", // 1-2 odcienie ciemniejszy
      contrastText: "#F7F5F2", // kontrastowy
    },
    tertiary: {
      main: "#99FF66", //zielony
      light: "#BBFF99",
      dark: "#85FF47",
      contrastText: "#F7F5F2",
    },
    error: { main: "#d32f2f", light: "#ef5350", dark: "#c62828" },
    success: {
      main: "#2e7d32",
      light: "#4caf50",
      dark: "#1b5e20",
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
      primary: "#F7F5F2",
      secondary: "#F7F5F2",
      disabled: "#bdbdbd",
    },
    background: {
      default: "#222222", // tu tez zdefiniuj wartosci
      paper: "#222222",
    },
    action: {
      active: "rgba(0, 0, 0, 0.54)",
      hover: "rgba(0, 0, 0, 0.04)",
      hoverOpacity: 0.04,
      selected: "rgba(0, 0, 0, 0.08)",
      selectedOpacity: 0.08,
      disabled: "rgba(0, 0, 0, 0.26)",
      disabledBackground: "rgba(0, 0, 0, 0.12)",
      disabledOpacity: 0.38,
      focus: "rgba(0, 0, 0, 0.12)",
      focusOpacity: 0.12,
      activatedOpacity: 0.12,
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
      fontWeight: 600,
    },
    h3: {
      fontSize: "1.875rem",
      fontWeight: 500,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 400,
    },
    h5: {
      fontSize: "1.5rem",
      fontWeight: 400,
    },
    h6: {
      fontSize: "1.5rem",
      fontWeight: "bold",
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
