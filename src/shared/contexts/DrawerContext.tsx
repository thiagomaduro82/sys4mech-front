import { createContext, useCallback, useContext, useState } from "react";

interface IDrawerContextProps {
    children: React.ReactNode;
};

interface IDrawerContext {
    isOpen: boolean;
    toggleDrawer: () => void;
    drawerOptions: IDrawerOptions[];
    setDrawerOptions: (options: IDrawerOptions[]) => void;
};

interface IDrawerOptions {
    label: string;
    icon: string;
    path: string;
};

const DrawerContext = createContext({} as IDrawerContext);

export const useDrawerContext = () => {
    return useContext(DrawerContext)
};

export const DrawerProvider = ({ children }: IDrawerContextProps) => {

    const [isOpen, setIsOpen] = useState(false);
    const [drawerOptions, setDrawerOptions] = useState<IDrawerOptions[]>([]);

    const toggleDrawer = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    const handleSetDrawerOptions = useCallback((options: IDrawerOptions[]) => {
        setDrawerOptions(options);
    }, []);

    return (
        <DrawerContext.Provider value={{ isOpen, toggleDrawer, drawerOptions, setDrawerOptions: handleSetDrawerOptions }}>
            {children}
        </DrawerContext.Provider>
    );
};

