import { useEffect } from "react";
import { useDrawerContext } from "../shared/contexts/DrawerContext";
import { Navigate, Route, Routes } from "react-router-dom";
import { Home, RoleList, PermissionList, PermissionDetail, RoleDetail, UserList, UserDetail, EmployeeList, EmployeeDetail, CustomerList, CustomerDetail, ServiceList, ServiceDetail, SupplierList, SupplierDetail } from "../pages";
import { useHasPermission } from "../shared/hooks";

export const AppRoutes = () => {

    const { setDrawerOptions } = useDrawerContext();

    const canViewRoles = useHasPermission('ROLE_READ');
    const canWriteRoles = useHasPermission('ROLE_WRITE');
    const canViewPermissions = useHasPermission('PERMISSION_READ');
    const canWritePermissions = useHasPermission('PERMISSION_WRITE');
    const canViewUsers = useHasPermission('USER_READ');
    const canWriteUsers = useHasPermission('USER_WRITE');
    const canViewEmployees = useHasPermission('EMPLOYEE_READ');
    const canWriteEmployees = useHasPermission('EMPLOYEE_WRITE');
    const canViewCustomers = useHasPermission('CUSTOMER_READ');
    const canWriteCustomers = useHasPermission('CUSTOMER_WRITE');
    const canViewServices = useHasPermission('SERVICE_READ');
    const canWriteServices = useHasPermission('SERVICE_WRITE');
    const canViewSuppliers = useHasPermission('SUPPLIER_READ');
    const canWriteSuppliers = useHasPermission('SUPPLIER_WRITE');
    const canViewCarParts = useHasPermission('CAR_PARTS_READ');
    const canWriteCarParts = useHasPermission('CAR_PARTS_WRITE');
    const canViewServiceOrders = useHasPermission('SERVICE_ORDERS_READ');
    const canWriteServiceOrders = useHasPermission('SERVICE_ORDERS_WRITE');
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
        if (canViewServices) {
            drawerOptions.push({ label: 'Services', icon: 'handyman', path: '/services' });
        }
        if (canViewSuppliers) {
            drawerOptions.push({ label: 'Suppliers', icon: 'widgets', path: '/suppliers' });
        }
        if (canViewCarParts) {
            drawerOptions.push({ label: 'Car Parts', icon: 'car_crash', path: '/car-parts' });
        }
        if (canViewServiceOrders) {
            drawerOptions.push({ label: 'Service Order', icon: 'car_repair', path: '/service-orders' });
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
        
        setDrawerOptions(drawerOptions);
    }, [
        setDrawerOptions,
        canViewRoles,
        canViewPermissions,
        canViewUsers,
        canViewEmployees,
        canViewCustomers,
        canViewServices,
        canViewSuppliers,
        canViewCarParts,
        canViewServiceOrders,
        canViewHome
    ]);

    return (
        <Routes>
            {(canViewHome) && <Route path="/" element={<Home />} />}
            {(canViewRoles) && <Route path="/roles" element={<RoleList />} />}
            {(canWriteRoles) && <Route path="/roles/detail/:uuid" element={<RoleDetail />} />}
            {(canViewPermissions) && <Route path="/permissions" element={<PermissionList />} />}
            {(canWritePermissions) && <Route path="/permissions/detail/:uuid" element={<PermissionDetail />} />}
            {(canViewUsers) && <Route path="/users" element={<UserList />} />}
            {(canWriteUsers) && <Route path="/users/detail/:uuid" element={<UserDetail />} />}
            {(canViewEmployees) && <Route path="/employees" element={<EmployeeList />} />}
            {(canWriteEmployees) && <Route path="/employees/detail/:uuid" element={<EmployeeDetail />} />}
            {(canViewCustomers) && <Route path="/customers" element={<CustomerList />} />}
            {(canWriteCustomers) && <Route path="/customers/detail/:uuid" element={<CustomerDetail />} />}
            {(canViewServices) && <Route path="/services" element={<ServiceList />} />}
            {(canWriteServices) && <Route path="/services/detail/:uuid" element={<ServiceDetail />} />}
            {(canViewSuppliers) && <Route path="/suppliers" element={<SupplierList />} />}
            {(canWriteSuppliers) && <Route path="/suppliers/detail/:uuid" element={<SupplierDetail />} />}
            {(canViewHome) && <Route path="*" element={<Navigate to={'/'} />} />}
        </Routes>
    );
};