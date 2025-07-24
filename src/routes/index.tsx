import { useEffect } from "react";
import { useDrawerContext } from "../shared/contexts/DrawerContext";
import { Navigate, Route, Routes } from "react-router-dom";
import { Home, RoleList, PermissionList, PermissionDetail, RoleDetail, UserList, UserDetail, EmployeeList, EmployeeDetail, CustomerList, CustomerDetail } from "../pages";
import { useHasPermission } from "../shared/hooks";

export const AppRoutes = () => {

    const { setDrawerOptions } = useDrawerContext();

    const canViewRoles = useHasPermission('ROLE_READ');
    const canViewPermissions = useHasPermission('PERMISSION_READ');
    const canViewUsers = useHasPermission('USER_READ');
    const canViewEmployees = useHasPermission('EMPLOYEE_READ');
    const canViewCustomers = useHasPermission('CUSTOMER_READ');
    const canViewServices = useHasPermission('SERVICE_READ');
    const canViewCarParts = useHasPermission('CAR_PARTS_READ');
    const canViewServiceOrders = useHasPermission('SERVICE_ORDERS_READ');
    const canViewHome = useHasPermission('HOME_VIEW');

    useEffect(() => {
        const drawerOptions = [];
        if (canViewHome) {
            drawerOptions.push({ label: 'Home', icon: 'home', path: '/' });
        }
        if (canViewEmployees) {
            drawerOptions.push({ label: 'Employee', icon: 'person_3', path: '/employees' });
        }
        if (canViewCustomers) {
            drawerOptions.push({ label: 'Customers', icon: 'peoples', path: '/customers' });
        }
        if (canViewRoles) {
            drawerOptions.push({ label: 'Roles', icon: 'shield', path: '/roles' });
        }
        if (canViewPermissions) {
            drawerOptions.push({ label: 'Permission', icon: 'security', path: '/permissions' });
        }
        if (canViewUsers) {
            drawerOptions.push({ label: 'User', icon: 'person', path: '/users' });
        }
        if (canViewServices) {
            drawerOptions.push({ label: 'Services', icon: 'handyman', path: '/permissions' });
        }
        if (canViewCarParts) {
            drawerOptions.push({ label: 'Car Parts', icon: 'car_crash', path: '/permissions' });
        }
        if (canViewServiceOrders) {
            drawerOptions.push({ label: 'Service Order', icon: 'car_repair', path: '/permissions' });
        }
        
        setDrawerOptions(drawerOptions);
    }, [
        setDrawerOptions,
        canViewRoles,
        canViewPermissions,
        canViewUsers,
        canViewEmployees,
        canViewCustomers,
        canViewServices,
        canViewCarParts,
        canViewServiceOrders,
        canViewHome
    ]);

    return (
        <Routes>
            {(canViewHome) && <Route path="/" element={<Home />} />}
            {(canViewRoles) && <Route path="/roles" element={<RoleList />} />}
            {(canViewRoles) && <Route path="/roles/detail/:uuid" element={<RoleDetail />} />}
            {(canViewPermissions) && <Route path="/permissions" element={<PermissionList />} />}
            {(canViewPermissions) && <Route path="/permissions/detail/:uuid" element={<PermissionDetail />} />}
            {(canViewUsers) && <Route path="/users" element={<UserList />} />}
            {(canViewUsers) && <Route path="/users/detail/:uuid" element={<UserDetail />} />}
            {(canViewEmployees) && <Route path="/employees" element={<EmployeeList />} />}
            {(canViewEmployees) && <Route path="/employees/detail/:uuid" element={<EmployeeDetail />} />}
            {(canViewCustomers) && <Route path="/customers" element={<CustomerList />} />}
            {(canViewCustomers) && <Route path="/customers/detail/:uuid" element={<CustomerDetail />} />}
            {(canViewHome) && <Route path="*" element={<Navigate to={'/'} />} />}
        </Routes>
    );
};