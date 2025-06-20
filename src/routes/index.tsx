import { useEffect } from "react";
import { useDrawerContext } from "../shared/contexts/DrawerContext";
import { Navigate, Route, Routes } from "react-router-dom";
import { Home, RoleList, PermissionList, PermissionDetail, RoleDetail } from "../pages";


export const AppRoutes = () => {

    const { setDrawerOptions } = useDrawerContext();

    useEffect(() => {
        setDrawerOptions([
            { label: 'Home', icon: 'home', path: '/' },
            { label: 'Roles', icon: 'shield', path: '/roles' },
            { label: 'Permission', icon: 'security', path: '/permissions' },
            { label: 'User', icon: 'person', path: '/users' },
            { label: 'Employee', icon: 'person_3', path: '/permissions' },
            { label: 'Customers', icon: 'peoples', path: '/permissions' },
            { label: 'Services', icon: 'handyman', path: '/permissions' },
            { label: 'Car Parts', icon: 'car_crash', path: '/permissions' },
            { label: 'Service Order', icon: 'car_repair', path: '/permissions' },
        ]);
    }, [setDrawerOptions]);

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/roles" element={<RoleList />} />
            <Route path="/roles/detail/:uuid" element={<RoleDetail />} />
            <Route path="/permissions" element={<PermissionList />} />
            <Route path="/permissions/detail/:uuid" element={<PermissionDetail />} />
            <Route path="*" element={<Navigate to={'/'} />} />
        </Routes>
    );
};