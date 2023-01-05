import { Modal, Form, message, Button } from 'antd';
import { useMemo, useEffect, useState, useCallback } from 'react';
import { AdminLayout } from '../../components/common/admin-layout.component.js';
import { ManagementList } from '../../components/management-list.component.js';
import { CreateIdentityModal } from '../../components/create-identity.component.js';
import { RechargeMoneyForm } from '../../components/recharge-money-form.component.js';
import { HistoryTrackingForm } from '../../components/history-tracking-form.component.js';
import { BankTransactionHistoryForm } from '../../components/bank-transaction-history-form.component.js';
import styled from "@xstyled/styled-components";
import Title from "antd/es/typography/Title.js";
import { CreateEmployeeForm } from '../../components/create-employee-form.component.js';

export const AdminDashboardPage = ({ setAuth }) => {
    const [
        isBankTransactionHistoryModalVisible,
        setBankTransactionHistoryModalVisibility,
    ] = useState(false);

    const toggleBankTransactionHistoryModalVisibility = () => {
        setBankTransactionHistoryModalVisibility(
            !isBankTransactionHistoryModalVisible
        );
    };

    const [
        isAddEmloyeeModalVisible,
        setAddEmloyeeModalVisibility,
    ] = useState(false);

    const handleAddEmloyeeClick = () => {
        setAddEmloyeeModalVisibility(
            !isAddEmloyeeModalVisible
        );
    };

    const ListEmployee= styled.div``;

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
        <AdminLayout setAuth={setAuth}>
            <ListEmployee>
                <Title level={2}>Danh sách nhân viên</Title>
            </ListEmployee>
            <Button type="primary" onClick={handleAddEmloyeeClick}>
                Thêm nhân viên
            </Button>
            <Modal
                title='Thêm nhân viên'
                centered
                open={isAddEmloyeeModalVisible}
                onOk={handleAddEmloyeeClick}
                onCancel={handleAddEmloyeeClick}>
                <CreateEmployeeForm/>
            </Modal>
            <Modal
                title='Theo dõi lịch sử giao dịch các ngân hàng'
                centered
                open={isBankTransactionHistoryModalVisible}
                onOk={toggleBankTransactionHistoryModalVisibility}
                onCancel={toggleBankTransactionHistoryModalVisibility}>
                <BankTransactionHistoryForm />
            </Modal>
            <ManagementList sources={settingItems} />
        </AdminLayout>
    );
};
