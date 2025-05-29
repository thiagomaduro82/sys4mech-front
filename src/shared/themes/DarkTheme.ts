import { createTheme } from "@mui/material";
import { blue, cyan } from "@mui/material/colors";

export const DarkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: blue[800],
            dark: blue[900], 
            light: blue[700], 
            contrastText: "#ffffff",  
        },
        secondary: {
            main: cyan[800],
            dark: cyan[900], 
            light: cyan[700], 
            contrastText: "#ffffff",
        },
        background: {
            default: "#121212", 
            paper: "#1e1e1e", 
        }
    },
    typography: {
        allVariants: {
            color: "#ffffff",
        }
    }
});