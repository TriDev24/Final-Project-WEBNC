import { useEffect, useState, useCallback, useMemo } from 'react';
import { Button, Checkbox, message, Modal, Skeleton, Table } from 'antd';
import { ManagementList } from '../../components/management-list.component.js';
import { BankTransactionHistoryForm } from '../../components/bank-transaction-history-form.component.js';
import styled from '@xstyled/styled-components';
import Title from 'antd/es/typography/Title.js';
import { CreateEmployeeForm } from '../../components/create-employee-form.component.js';
import ContentLayout from '../../components/common/content-layout.component.js';

const FlexLayout = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const TransactionPage = () => {
    const [
        isBankTransactionHistoryModalVisible,
        setBankTransactionHistoryModalVisibility,
    ] = useState(false);

    const toggleBankTransactionHistoryModalVisibility = () => {
        setBankTransactionHistoryModalVisibility(
            !isBankTransactionHistoryModalVisible
        );
    };

    const settingItems = useMemo(
        () => [
            {
                title: 'Xem danh sách giao dịch trong tháng với các ngân hàng khác',
                description:
                    'Xem được các giao dịch: Xem trong khoảng thời gian. Xem theo từng ngân hàng, hoặc tất cả ngân hàng liên kết. Có thống kê tổng số tiền đã giao dịch',
                actionTitle: 'Xem lịch sử',
                onItemClick: toggleBankTransactionHistoryModalVisibility,
            },
        ],
        []
    );

    return (
        <ContentLayout>
            <Modal
                title='Theo dõi lịch sử giao dịch các ngân hàng'
                centered
                open={isBankTransactionHistoryModalVisible}
                onOk={toggleBankTransactionHistoryModalVisibility}
                onCancel={toggleBankTransactionHistoryModalVisibility}>
                <BankTransactionHistoryForm />
            </Modal>
            <ManagementList sources={settingItems} />
        </ContentLayout>
    );
};
