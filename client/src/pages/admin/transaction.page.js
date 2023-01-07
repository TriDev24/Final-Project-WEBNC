import { useEffect, useState, useCallback, useMemo } from 'react';
import { Button, Checkbox, message, Modal, Skeleton, Table, Select } from 'antd';
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
    const [listBillingAll, setListBillingAll] = useState(null);

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
        getListBillingAll();
    }, []);

    const getListBillingAll = useCallback(() => {
        const url = `${process.env.REACT_APP_BILLING_API_URL_PATH}/payment-history`;
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('accessToken'),
            },
        })
            .then((response) => response.json())
            .then((data) => setListBillingAll(data));
        setListBilling(listBillingAll);
        console.log(listBilling);
    }, []);

    const onChange = (value) => {
        if (value === "All"){
            setListBilling(listBillingAll);
        }
        else{
            console.log({listBillingAll});
            if (value === "My Bank"){
                console.log({value});
                const listBillingFilter = listBillingAll.filter(
                    (p) => p.senderName === value && p.receiveName === value
                );
                setListBilling(listBillingFilter);
            }
            else {
                const listBillingFilter = listBillingAll.filter(
                    (p) => p.senderName === value || p.receiveName === value
                );
                setListBilling(listBillingFilter);
            }
            
        }
      };

    const onSearch = (value) => {
    console.log('search:', value);
    };

  const renderListFilter = () => {
        return (
            <Select
            name="filter"
            showSearch
            placeholder="Select a type"
            optionFilterProp="children"
            style={{
                width: 160,
              }}
            onChange={onChange}
            onSearch={onSearch}
            filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={[
            {
                value: 'All',
                label: 'Tất cả',
            },
            {
                value: 'My Bank',
                label: 'Nội bộ',
            },
            {
                value: 'Another Bank',
                label: 'Liên ngân hàng',
            }
            ]}
        />
        
        );
    };

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
                    <Title level={3}>Lựa chọn xem giao dịch</Title>
                </FlexLayout>
                {renderListFilter()}
                
                <FlexLayout>
                    <Title level={2}>Danh sách giao dịch các ngân hàng</Title>
                </FlexLayout>
                {renderListBilling()}
            </ListEmployee>
        </ContentLayout>
    );
};
