import React, { useState } from "react";
import { CreditCardOutlined } from "@ant-design/icons";
import { Layout, Menu, theme, Image, Space, Typography } from "antd";
import { Link, Route, Routes } from "react-router-dom";
import IdentityOption from "../identity-option.component.js";
import { AdminDashboardPage } from "../../pages/admin/dashboard.page.js";

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
      <Link to="/admin/dashboard">Nhân viên</Link>
    </>,
    "1",
    <CreditCardOutlined />
  ),
  getItem(
    <>
      <Link to="/admin/dashboard/transaction">Giao dịch</Link>
    </>,
    "2",
    <CreditCardOutlined />
  ),
];

export const AdminLayout = () => {
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
              <IdentityOption></IdentityOption>
            </Space>
          </Header>
          <Routes>
            <Route path={`/dashboard`} element={<AdminDashboardPage />}></Route>
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
