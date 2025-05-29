import { Box, ThemeProvider } from "@mui/material";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { DarkTheme, LightTheme } from "../themes";

interface IAppThemeContext {
    themeName: 'light' | 'dark';
    toggleTheme: () => void;
};

interface IAppThemeProviderProps {
    children: React.ReactNode;
}

const AppThemeContext = createContext({} as IAppThemeContext);

export const useAppThemeContext = () => {
    return useContext(AppThemeContext);
};

export const AppThemeProvider: React.FC<IAppThemeProviderProps> = ({ children }) => {

    const [themeName, setThemeName] = useState<'light' | 'dark'>('light');

    const toggleTheme = useCallback(() => {
        setThemeName((prev) => (prev === 'light' ? 'dark' : 'light'));
    }, []);

    const theme = useMemo(() => {
        return themeName === 'light' ? LightTheme : DarkTheme
    }, [themeName]);

    return (
        <AppThemeContext.Provider value={{ themeName, toggleTheme }}>
            <ThemeProvider theme={theme}>
                <Box width={'100vw'} height={'100vh'} bgcolor={theme.palette.background.default} >
                    {children}
                </Box>
            </ThemeProvider>
        </AppThemeContext.Provider>
    );
};

