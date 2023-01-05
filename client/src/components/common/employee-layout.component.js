import React from "react";
import { Layout, theme, Space, Image } from "antd";
import IdentityOption from "../identity-option.component.js";
import { Typography } from "antd";

const { Title } = Typography;
const { Header, Content, Footer } = Layout;

export const EmployeeLayout = ({ children }) => {
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
            <Space size={1070}>
              <Space>
                <Image
                  style={{ marginBottom: "5px" }}
                  height={50}
                  width={50}
                  src="/images/logo.png"
                ></Image>
                <Title italic style={{ marginTop: "5px" }} type="secondary" level={3}>Internet Banking</Title>
              </Space>
              <IdentityOption></IdentityOption>
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
