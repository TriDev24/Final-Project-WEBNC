import React, { useState } from "react";
import {
  CreditCardOutlined,
  BankOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Image, Space } from "antd";
import { Link } from "react-router-dom";
import Notify from "../dashboard/notify.component.js";
import IdentityOption from "../identity-option.component.js";

const { Header, Content, Footer, Sider } = Layout;

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

export const CustomerLayout = ({ selected, setAuth, children }) => {
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
            defaultSelectedKeys={[`${selected}`]}
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
              <IdentityOption setAuth={setAuth}></IdentityOption>
            </Space>
          </Header>
          <Content
            style={{
              margin: "0 16px",
            }}
          >
            <div
              style={{
                margin: "16px 0",
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
              }}
            >
              {children}
            </div>
          </Content>
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
