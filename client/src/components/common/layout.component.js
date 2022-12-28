import React, { useState } from 'react';
import {
    CreditCardOutlined,
    BankOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Avatar, Layout, Menu, theme, Image } from 'antd';
import DebitTable from '../dashboard/debit.component.js';
import DebtorTable from '../dashboard/debtor.component.js';

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
    getItem('Tài khoản', '1', <CreditCardOutlined />),
    getItem('Nhắc nợ', '2', <BankOutlined />, [
        getItem('Cá nhân', '3', <UserOutlined />),
        getItem('Người khác', '4', <UserOutlined />),
        getItem('Danh sách người nợ', '5', <UserOutlined />),
    ]),
];

export const AppLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState('1');

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const componentsSwitch = (key) => {
        switch (key) {
            case '1':
                return children;
            case '3':
                return <DebitTable side={'personal'} />;
            case '4':
                return <DebitTable side={'other'} />;
            case '5':
                return <DebtorTable />;
            default:
                break;
        }
    };

    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}>
                <div style={{ textAlign: 'center', margin: '20px' }}>
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
                    <Avatar size='large' src='/images/avatar.png'></Avatar>
                </Header>
                <Content
                    style={{
                        margin: '0 16px',
                    }}>
                    <div
                        style={{
                            minHeight: '100vh',
                        }}>
                        <div
                            style={{
                                margin: '16px 0',
                                padding: 24,
                                minHeight: 360,
                                background: colorBgContainer,
                            }}>
                            {componentsSwitch(selectedMenuItem)}
                        </div>

                        <Footer
                            style={{
                                textAlign: 'center',
                            }}>
                            Internet Banking Footer
                        </Footer>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};
