import { Routes, Route, Navigate } from 'react-router-dom';
import { CustomerDashBoardPage } from './pages/customer/dashboard.page.js';
import { LoginPage } from './pages/login.page.js';
import { EmployeeDashboardPage } from './pages/employee/dashboard.page.js';
import { AdminDashboardPage } from './pages/admin/dashboard.page.js';
import { ForgotPasswordPage } from './pages/forgot-password.page.js';
import 'antd/dist/reset.css';

export const App = () => {
    const setUpCustomerRoutes = () => (
        <>
            <Route
                path='/dashboard'
                element={<CustomerDashBoardPage />}></Route>
        </>
    );

    const setUpEmployeeRoutes = () => {
        const basePath = 'employee';

        return (
            <>
                <Route
                    path={`${basePath}/dashboard`}
                    element={<EmployeeDashboardPage />}></Route>
            </>
        );
    };

    const setUpAdminRoutes = () => {
        const basePath = 'admin';

        return (
            <>
                <Route
                    path={`${basePath}/dashboard`}
                    element={<AdminDashboardPage />}></Route>
            </>
        );
    };

    return (
        <>
            <Routes>
                <Route
                    path='/'
                    element={<Navigate to='/dashboard' replace />}></Route>
                <Route path='/login' element={<LoginPage />}></Route>
                <Route path='/forgot-password' element={<ForgotPasswordPage/>}></Route>
                {setUpCustomerRoutes()}
                {setUpEmployeeRoutes()}
                {setUpAdminRoutes()}
            </Routes>
        </>
    );
};
