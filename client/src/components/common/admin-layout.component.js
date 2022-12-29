import React, { useEffect, useState } from 'react';
import {
    CreditCardOutlined,
    BankOutlined,
    UserOutlined,
    BellOutlined,
} from '@ant-design/icons';
import {
    Avatar,
    Layout,
    Menu,
    theme,
    Image,
    Dropdown,
    Space,
    Button,
    Badge,
    Alert,
    Result,
} from 'antd';
import DebitTable from '../dashboard/debit.component.js';
import DebtorTable from '../dashboard/debtor.component.js';
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

const items = [
    getItem('Tài khoản', '1', <CreditCardOutlined />),
    getItem('Nhắc nợ', '2', <BankOutlined />, [
        getItem('Cá nhân', '3', <UserOutlined />),
        getItem('Người khác', '4', <UserOutlined />),
        getItem('Danh sách người nợ', '5', <UserOutlined />),
    ]),
];

export const AdminLayout = ({ children }) => {
    const [count, setCount] = useState(0);
    const [collapsed, setCollapsed] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState('1');
    const [dropItems, setDropItems] = useState([]);

    useEffect(() => {
        const fetchApi = async () => {
            const url = `${
                process.env.REACT_APP_DEBIT_URL_PATH
            }/notify/${localStorage.getItem('payment-account-number')}`;

            const result = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: localStorage.getItem('accessToken'),
                },
            })
                .then((response) => response.json())
                .then((data) => data);
            const items = result.debits.map((debit, index) => {
                let message = `Tài khoản ${debit.accountId.accountNumber} đã gửi cho bạn một nhắc nợ`;
                if (debit.statusId.name === 'paid') {
                    message = `Tài khoản ${debit.accountId.accountNumber} đã thanh toán nhắc nợ của bạn`;
                } else if (debit.statusId.name === 'cancelled') {
                    message = `Nhắc nợ của tài khoản ${debit.accountId.accountNumber} đã được hủy`;
                }
                return getItem(<Alert message={message} type='info' />, index);
            });
            setDropItems(items);
            setCount(result.count);
        };
        fetchApi();
    }, []);

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

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const renderLayoutContentOrErrorPage = () => {
        const { role } = getProfileFromLocalStorage();
        const isNotAdminRole = role !== 'admin';
        return (
            <>
                {isNotAdminRole ? (
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
                                    <Dropdown
                                        menu={{
                                            items: dropItems,
                                        }}
                                        placement='bottomLeft'
                                        arrow={{
                                            pointAtCenter: true,
                                        }}>
                                        <Badge size='small' count={count}>
                                            <Button
                                                icon={
                                                    <BellOutlined />
                                                }></Button>
                                        </Badge>
                                    </Dropdown>
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
                                    {componentsSwitch(selectedMenuItem)}
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
