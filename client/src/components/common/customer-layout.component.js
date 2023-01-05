import React, { useState } from "react";
import {
  CreditCardOutlined,
  BankOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Image, Space, Typography } from "antd";
import { Link, Route, Routes } from "react-router-dom";
import Notify from "../dashboard/notify.component.js";
import IdentityOption from "../identity-option.component.js";
import DebitPage from "../../pages/customer/debit.page.js";
import { CustomerDashBoardPage } from "../../pages/customer/dashboard.page.js";
import { marginLeft } from "@xstyled/styled-components";

const { Title } = Typography;
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
          <div
            style={{
              textAlign: "center",
              marginTop: "20px",
              marginBottom: "5px",
            }}
          >
            <Image height={40} width={40} src="/images/logo.png"></Image>
          </div>
          <div style={{ textAlign: "center" }}>
            <Title style={{ color: "white" }} italic level={4}>
              Internet Banking
            </Title>
          </div>

          <Menu
            theme="dark"
            defaultSelectedKeys={["1"]}
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
