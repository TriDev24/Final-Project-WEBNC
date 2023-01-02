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
import DebitPage from "./pages/customer/dashboard-debit.page.js";

const PageScreen = styled.div`
  width: 100vw;
  height: 100vh;
`;

export const App = () => {
  const [isLoading, setLoadingStatus] = useState(true);
  const [isAuth, setAuth] = useState(getProfileFromLocalStorage());

  useEffect(() => {
    setLoadingStatus(false);
  }, []);

  const setUpCustomerRoutes = () => {
    const basePath = "customer";

    return (
      <>
        <Route
          path={`${basePath}/dashboard`}
          element={<CustomerDashBoardPage setAuth={setAuth} />}
        ></Route>
        <Route
          path={`${basePath}/dashboard/debit/:side`}
          element={<DebitPage setAuth={setAuth} />}
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
          element={<EmployeeDashboardPage setAuth={setAuth} />}
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
          element={<AdminDashboardPage setAuth={setAuth} />}
        ></Route>
      </>
    );
  };

  const renderConditionally = () => {
    if (!isAuth) {
      return (
        <Routes>
          <Route path="/*" element={<Navigate to="/login" replace />}></Route>
          <Route
            path="/login"
            element={<LoginPage setAuth={setAuth} />}
          ></Route>
          <Route
            path="/forgot-password"
            element={<ForgotPasswordPage />}
          ></Route>
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
            <Route
              path="/login"
              element={<LoginPage setAuth={setAuth} />}
            ></Route>
            <Route
              path="/forgot-password"
              element={<ForgotPasswordPage />}
            ></Route>
            {setUpCustomerRoutes()}
            {setUpEmployeeRoutes()}
            {setUpAdminRoutes()}
            <Route
              path="*"
              element={
                <Result
                  status="404"
                  title="404"
                  subTitle="Xin lỗi, trang bạn muốn truy cập không tồn tại"
                />
              }
            ></Route>
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
