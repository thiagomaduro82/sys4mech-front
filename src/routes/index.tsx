import { useEffect } from "react";
import { useDrawerContext } from "../shared/contexts/DrawerContext";
import { Navigate, Route, Routes } from "react-router-dom";
import { Home, RoleList, PermissionList, PermissionDetail } from "../pages";


export const AppRoutes = () => {

    const { setDrawerOptions } = useDrawerContext();

    useEffect(() => {
        setDrawerOptions([
            { label: 'Home', icon: 'home', path: '/' },
            { label: 'Roles', icon: 'shield', path: '/roles' },
            { label: 'Permission', icon: 'security', path: '/permissions' }
        ]);
    }, [setDrawerOptions]);

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/roles" element={<RoleList />} />
            <Route path="/permissions" element={<PermissionList />} />
            <Route path="/permissions/detail/:uuid" element={<PermissionDetail />} />
            <Route path="*" element={<Navigate to={'/'} />} />
        </Routes>
    );
};