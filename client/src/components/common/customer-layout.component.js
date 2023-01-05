import React, { useState } from "react";
import {
  CreditCardOutlined,
  BankOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Image, Space } from "antd";
import { Link, Route, Routes } from "react-router-dom";
import Notify from "../dashboard/notify.component.js";
import IdentityOption from "../identity-option.component.js";
import DebitPage from "../../pages/customer/debit.page.js";
import { CustomerDashBoardPage } from "../../pages/customer/dashboard.page.js";

const { Header, Footer, Sider } = Layout;

const getItem = (label, key, icon, children) => {
  return {
    key,
    icon,
    children,
    label,
  };
};

const items = [
  getItem(
    <>
      <Link to="/customer/dashboard">Tài khoản</Link>
    </>,
    "1",
    <CreditCardOutlined />
  ),
  getItem("Nhắc nợ", "2", <BankOutlined />, [
    getItem(
      <>
        <Link to="/customer/dashboard/debit/personal">Cá nhân</Link>
      </>,
      "3",
      <UserOutlined />
    ),
    getItem(
      <>
        <Link to="/customer/dashboard/debit/other">Người khác</Link>
      </>,
      "4",
      <UserOutlined />
    ),
    getItem(
      <>
        <Link to="/customer/dashboard/debit/debtor">Danh sách người nợ</Link>
      </>,
      "5",
      <UserOutlined />
    ),
  ]),
];

export const CustomerLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <>
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div style={{ textAlign: "center", margin: "20px" }}>
            <Image height={40} width={40} src="/images/logo.png"></Image>
          </div>
          <Menu
            theme="dark"
            defaultSelectedKeys={['1']}
            mode="inline"
            items={items}
          />
        </Sider>
        <Layout className="site-layout">
          <Header
            style={{
              padding: "0 40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              background: colorBgContainer,
            }}
          >
            <Space>
              <Notify></Notify>
              <IdentityOption></IdentityOption>
            </Space>
          </Header>
          <Routes>
            <Route
              path={`/dashboard`}
              element={<CustomerDashBoardPage />}
            ></Route>
            <Route
              path={`/dashboard/debit/:side`}
              element={<DebitPage />}
            ></Route>
          </Routes>

          <Footer
            style={{
              textAlign: "center",
            }}
          >
            Internet Banking Footer
          </Footer>
        </Layout>
      </Layout>
    </>
  );
};
