import React, { useState } from "react";
import { Layout, Menu, theme, Image, Space} from "antd";
import IdentityOption from "../identity-option.component.js";

const { Header, Content, Footer, Sider } = Layout;

const items = [];

export const EmployeeLayout = ({ setAuth, children }) => {
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
