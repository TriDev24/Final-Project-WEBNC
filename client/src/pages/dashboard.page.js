import Title from 'antd/es/typography/Title.js';
import { AppLayout } from '../components/common/index.js';
import styled from '@xstyled/styled-components';
import { Button, Table } from 'antd';
import { ServiceList } from '../components/dashboard/index.js';
import { ContactsOutlined, SwapOutlined } from '@ant-design/icons';


const GeneralInformationSection = styled.div`
    display: flex;
    justify-content: space-between;
`;

const ServiceSection = styled.div`
    margin: 30px 0px;
`;

const HistorySection = styled.div``;

export const DashBoardPage = () => {
    const services = [
        {
            icon: <SwapOutlined />,
            name: 'Chuyển tiền',
            onClick: () => {},
        },
        {
            icon: <ContactsOutlined />,
            name: 'Ghi nợ',
            onClick: () => {},
        },
    ];

    const dataSource = [];

    const columns = [
        {
            title: 'Số tài khoản',
            dataIndex: 'receiverId',
            key: 'receiverId',
        },
        {
            title: 'Số tiền',
            dataIndex: 'money',
            key: 'money',
        },
        {
            title: 'Hình thức',
            dataIndex: 'method',
            key: 'method',
        },
        {
            title: 'Nội dung',
            dataIndex: 'description',
            key: 'description',
        },
    ];

    return (
        <AppLayout>
            <GeneralInformationSection>
                <div>
                    <Title level={2}>General Information</Title>
                    <p>Account Number: </p>
                    <p>Account Name: </p>
                </div>
                <Button type='primary'>Change Account</Button>
            </GeneralInformationSection>

            <ServiceSection>
                <ServiceList sources={services} />
            </ServiceSection>

            <HistorySection>
                <Title level={2}>History</Title>
                <Table dataSource={dataSource} columns={columns} />
            </HistorySection>
        </AppLayout>
    );
};
