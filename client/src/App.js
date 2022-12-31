import { Routes, Route, Navigate } from "react-router-dom";
import { CustomerDashBoardPage } from "./pages/customer/dashboard.page.js";
import { LoginPage } from "./pages/login.page.js";
import { EmployeeDashboardPage } from "./pages/employee/dashboard.page.js";
import { AdminDashboardPage } from "./pages/admin/dashboard.page.js";
import { ForgotPasswordPage } from "./pages/forgot-password.page.js";
import "antd/dist/reset.css";
import { useEffect, useState } from "react";
import { getProfileFromLocalStorage } from "./utils/local-storage.util.js";
import { Result, Spin } from "antd";
import { styled } from "@xstyled/styled-components";

const PageScreen = styled.div`
  width: 100vw;
  height: 100vh;
`;

export const App = () => {
  const [isLoading, setLoadingStatus] = useState(true);
  const [isAuth, setAuth] = useState(getProfileFromLocalStorage());

  useEffect(() => {
    setLoadingStatus(!isLoading);
  }, []);

  const setUpCustomerRoutes = () => {
    const basePath = "customer";

    return (
      <>
        <Route
          path={`${basePath}/dashboard`}
          element={<CustomerDashBoardPage />}
        ></Route>
      </>
    );
  };

  const setUpEmployeeRoutes = () => {
    const basePath = "employee";

    return (
      <>
        <Route
          path={`${basePath}/dashboard`}
          element={<EmployeeDashboardPage />}
        ></Route>
      </>
    );
  };

  const setUpAdminRoutes = () => {
    const basePath = "admin";

    return (
      <>
        <Route
          path={`${basePath}/dashboard`}
          element={<AdminDashboardPage />}
        ></Route>
      </>
    );
  };

  const renderConditionally = () => {
    if (!isAuth) {
      return (
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/login" replace />}
          ></Route>
          <Route path="/login" element={<LoginPage setAuth={setAuth} />}></Route>
        </Routes>
      );
    }
    const { role } = getProfileFromLocalStorage();

    const currentUrl = window.location.href;

    const isNotRoleEmployee =
      role !== "employee" && currentUrl.includes("employee");
    const isNotRoleAdmin = role !== "admin" && currentUrl.includes("admin");
    const isNotRoleCustomer =
      role !== "customer" && currentUrl.includes("customer");

    if (isNotRoleEmployee || isNotRoleAdmin || isNotRoleCustomer) {
      return (
        <Result
          status="403"
          title="403"
          subTitle="Bạn không đủ quyền hạn để truy cập trang này"
        />
      );
    }

    return (
      <>
        {isLoading === true ? (
          <PageScreen>
            <Spin />
          </PageScreen>
        ) : (
          <Routes>
            <Route
              path="/"
              element={<Navigate to={getDefaultPath()} replace />}
            ></Route>
            <Route path="/login" element={<LoginPage setAuth={setAuth}/>}></Route>
            <Route
              path="/forgot-password"
              element={<ForgotPasswordPage />}
            ></Route>
            {setUpCustomerRoutes()}
            {setUpEmployeeRoutes()}
            {setUpAdminRoutes()}
          </Routes>
        )}
      </>
    );
  };

  const getDefaultPath = () => {
    const { role } = getProfileFromLocalStorage();

    return `${role}/dashboard`;
  };

  return <>{renderConditionally()}</>;
};
