import { Layout, theme } from "antd";

const { Content } = Layout;

function ContentLayout({ children }) {
    const {
        token: { colorBgContainer },
      } = theme.useToken();
  return (
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
  );
}

export default ContentLayout
