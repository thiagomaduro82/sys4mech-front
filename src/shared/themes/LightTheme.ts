import { createTheme } from "@mui/material";
import { blue, cyan } from "@mui/material/colors";

export const LightTheme = createTheme({
    palette: {
        mode: "light",
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
            default: "#f5f5f5", // Light gray
            paper: "#ffffff", // White
        }
    }
});