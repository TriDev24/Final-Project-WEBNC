import React, { useState } from 'react';
import { CreditCardOutlined } from '@ant-design/icons';
import { Avatar, Layout, Menu, theme } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

const getItem = (label, key, icon, children) => {
    return {
        key,
        icon,
        children,
        label,
    };
};

const items = [getItem('Account', '1', <CreditCardOutlined />)];

export const AppLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}>
                <img
                    style={{
                        height: 40,
                        margin: 30,
                    }}
                    src='./images/logo.png'
                    alt='Logo'
                />
                <Menu
                    theme='dark'
                    defaultSelectedKeys={['1']}
                    mode='inline'
                    items={items}
                />
            </Sider>
            <Layout className='site-layout'>
                <Header
                    style={{
                        padding: '0 40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        background: colorBgContainer,
                    }}>
                    <Avatar
                        style={{
                            backgroundColor: '#f56a00',
                            verticalAlign: 'middle',
                        }}
                        size='large'>
                        TT
                    </Avatar>
                </Header>
                <Content
                    style={{
                        margin: '0 16px',
                    }}>
                    <div
                        style={{
                            margin: '16px 0',
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                        }}>
                        {children}
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}>
                    Internet Banking Footer
                </Footer>
            </Layout>
        </Layout>
    );
};
