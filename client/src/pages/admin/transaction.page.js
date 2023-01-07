import { useEffect, useState, useCallback, useMemo } from 'react';
import { Button, Checkbox, message, Modal, Skeleton, Table } from 'antd';
import styled from '@xstyled/styled-components';
import Title from 'antd/es/typography/Title.js';
import { CreateEmployeeForm } from '../../components/create-employee-form.component.js';
import ContentLayout from '../../components/common/content-layout.component.js';

const FlexLayout = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const TransactionPage = () => {
    const [listBilling, setListBilling] = useState(null);

    const historyColumns = useMemo(
        () => [
            {
                title: 'Ngân hàng gửi',
                dataIndex: 'senderName',
                key: 'senderName',
            },
            {
                title: 'Ngân hàng nhận',
                dataIndex: 'receiveName',
                key: 'receiveName',
            },
            {
                title: 'Tổng số tiền',
                dataIndex: 'deposit',
                key: 'deposit',
            },
            {
                title: 'Thời điểm giao dịch',
                dataIndex: 'transferTime',
                key: 'transferTime',
                render: (transferTime) =>
                    new Date(parseInt(transferTime)).toLocaleString(),
            },
        ],
        []
    );

    useEffect(() => {
        getListBilling();
    }, []);

    const getListBilling = useCallback(() => {
        const url = `${process.env.REACT_APP_BILLING_API_URL_PATH}/payment-history`;
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('accessToken'),
            },
        })
            .then((response) => response.json())
            .then((data) => setListBilling(data));
    }, []);

    const renderListBilling = () => {
        if (!listBilling) {
            return <Skeleton />;
        } else {
            // Danh sách nhân viên
            // const receiveBillings = paymentAccountHistory.filter(
            //     (p) => p.type === 'receive'
            // );
            const mappedListBilling = listBilling.map((r, index) => {
                return {
                    key: index,
                    senderName: r.senderName,
                    receiveName: r.receiveName,
                    deposit: r.deposit,
                    transferTime: r.transferTime,
                };
            });

            return (
                <>
                    <p>
                        <strong>
                            <i>Danh sách giao dịch</i>
                        </strong>
                    </p>
                    <Table
                        columns={historyColumns}
                        dataSource={mappedListBilling}
                    />
                </>
            );
        }
    };

    const ListEmployee = styled.div``;

    return (
        <ContentLayout>
            <ListEmployee>
                <FlexLayout>
                    <Title level={2}>Danh sách giao dịch các ngân hàng</Title>
                </FlexLayout>
                {renderListBilling()}
            </ListEmployee>
        </ContentLayout>
    );
};
