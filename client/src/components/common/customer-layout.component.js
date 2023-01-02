import React, { useState } from "react";
import {
  CreditCardOutlined,
  BankOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Image, Space } from "antd";
import DebitTable from "../dashboard/debit.component.js";
import DebtorTable from "../dashboard/debtor.component.js";
import Notify from "../dashboard/notify.component.js";
import { ChangePassword } from "../change-password.component.js";

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
  getItem("Tài khoản", "1", <CreditCardOutlined />),
  getItem("Nhắc nợ", "2", <BankOutlined />, [
    getItem("Cá nhân", "3", <UserOutlined />),
    getItem("Người khác", "4", <UserOutlined />),
    getItem("Danh sách người nợ", "5", <UserOutlined />),
  ]),
];

export const CustomerLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("1");

  const componentsSwitch = (key) => {
    switch (key) {
      case "1":
        return children;
      case "3":
        return <DebitTable side={"personal"} />;
      case "4":
        return <DebitTable side={"other"} />;
      case "5":
        return <DebtorTable />;
      default:
        break;
    }
  };

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
            defaultSelectedKeys={["1"]}
            mode="inline"
            items={items}
            onClick={(e) => setSelectedMenuItem(e.key)}
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
              <ChangePassword></ChangePassword>
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
              {componentsSwitch(selectedMenuItem)}
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
