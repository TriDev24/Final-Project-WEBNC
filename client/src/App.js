import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { LoginPage } from "./pages/login.page.js";
import { EmployeeDashboardPage } from "./pages/employee/dashboard.page.js";
import { AdminDashboardPage } from "./pages/admin/dashboard.page.js";
import { ForgotPasswordPage } from "./pages/forgot-password.page.js";
import "antd/dist/reset.css";
import { useEffect, useState } from "react";
import { Result, Spin, message } from "antd";
import { styled } from "@xstyled/styled-components";
import { useStore, actions } from "./store";
import { CustomerLayout } from "./components/common/customer-layout.component.js";

const PageScreen = styled.div`
  width: 100vw;
  height: 100vh;
`;

export const App = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useStore();
  const { isAuth, profile } = state;
  const [isLoading, setLoadingStatus] = useState(true);

  const fetchToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      const data = JSON.stringify({
        refreshToken,
      });
      const result = await fetch(
        `${process.env.REACT_APP_IDENTITY_API_URL_PATH}/refresh-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: data,
        }
      )
        .then((response) => response.json())
        .then((data) => data);
      if (result.accessToken) {
        localStorage.setItem("accessToken", result.accessToken);
      } else {
        localStorage.clear();
        dispatch(actions.setAuth(false));
        message.info("Phiên đăng nhập của bạn đã hết hạn!").then(() => {
          navigate("/login");
        });
      }
    }
  };

  useEffect(() => {
    setLoadingStatus(false);
    fetchToken();
    const timeId = setInterval(() => {
      fetchToken();
    }, 50 * 1000);

    return () => clearInterval(timeId);
  }, []);

  const setUpCustomerRoutes = () => {
    const basePath = "customer";

    return (
      <>
        <Route path={`${basePath}/*`} element={<CustomerLayout />}></Route>
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
          <Route path="/*" element={<Navigate to="/login" replace />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route
            path="/forgot-password"
            element={<ForgotPasswordPage />}
          ></Route>
        </Routes>
      );
    }
    const { role } = profile;

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
            <Route path="/login" element={<LoginPage />}></Route>
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
    const { role } = profile;

    return `${role}/dashboard`;
  };

  return <>{renderConditionally()}</>;
};
