import { useEffect } from "react";
import { useDrawerContext } from "../shared/contexts/DrawerContext";
import { Navigate, Route, Routes } from "react-router-dom";
import { Button } from "@mui/material";
import { Home } from "../pages";


export const AppRoutes = () => {

    const { setDrawerOptions } = useDrawerContext();

    useEffect(() => {
        setDrawerOptions([
            { label: 'Home', icon: 'home', path: '/' },
            { label: 'About', icon: 'info', path: '/about' },
            { label: 'Contact', icon: 'contact_mail', path: '/contact' }
        ]);
    }, [setDrawerOptions]);

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<Button>About</Button>} />
            <Route path="/contact" element={<Button>Contact</Button>} />
            <Route path="*" element={<Navigate to={'/'} />} />
        </Routes>
    );
};