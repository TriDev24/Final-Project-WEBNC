import React, { useState } from 'react';
import { Avatar, Layout, Menu, theme, Image, Space, Result } from 'antd';
import { getProfileFromLocalStorage } from '../../utils/local-storage.util.js';

const { Header, Content, Footer, Sider } = Layout;

const getItem = (label, key, icon, children) => {
    return {
        key,
        icon,
        children,
        label,
    };
};

const items = [];

export const EmployeeLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState('1');

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const renderLayoutContentOrErrorPage = () => {
        const { role } = getProfileFromLocalStorage();

        const isNotEmployeeRole = role !== 'employee';

        return (
            <>
                {isNotEmployeeRole ? (
                    <Result
                        status='403'
                        title='403'
                        subTitle='Bạn không đủ quyền hạn để truy cập trang này.'
                    />
                ) : (
                    <Layout
                        style={{
                            minHeight: '100vh',
                        }}>
                        <Sider
                            collapsible
                            collapsed={collapsed}
                            onCollapse={(value) => setCollapsed(value)}>
                            <div
                                style={{ textAlign: 'center', margin: '20px' }}>
                                <Image
                                    height={40}
                                    width={40}
                                    src='./images/logo.png'></Image>
                            </div>
                            <Menu
                                theme='dark'
                                defaultSelectedKeys={['1']}
                                mode='inline'
                                items={items}
                                onClick={(e) => setSelectedMenuItem(e.key)}
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
                                <Space>
                                    <Avatar
                                        size='large'
                                        src='/images/avatar.png'
                                        style={{
                                            marginBottom: '5px',
                                            marginLeft: '5px',
                                        }}></Avatar>
                                </Space>
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
                )}
            </>
        );
    };

    return <>{renderLayoutContentOrErrorPage()}</>;
};
