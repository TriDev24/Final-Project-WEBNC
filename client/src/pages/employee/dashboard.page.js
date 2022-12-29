import { Modal, Form, message } from 'antd';
import { useMemo, useEffect, useState, useCallback } from 'react';
import { EmployeeLayout } from '../../components/common/employee-layout.component.js';
import { ManagementList } from '../../components/management-list.component.js';
import { CreateIdentityModal } from '../../components/create-identity.component.js';
import { RechargeMoneyForm } from '../../components/recharge-money-form.component.js';
import { HistoryTrackingForm } from '../../components/history-tracking-form.component.js';

export const EmployeeDashboardPage = () => {
    const [bankAccounts, setBankAccounts] = useState(null);
    const [isCreateIdentityModalVisible, setCreateIdentityModalVisibility] =
        useState(false);
    const [rechargeMoneyForm] = Form.useForm();
    const [isRechargeMoneyModalVisible, setRechargeMoneyModalVisibility] =
        useState(false);
    const [
        isWatchMoneyTransferHistoryModalVisible,
        setWatchMoneyTransferHistoryModalVisibility,
    ] = useState(false);

    const toggleCreateIdentityModalVisibility = () => {
        setCreateIdentityModalVisibility(!isCreateIdentityModalVisible);
    };

    const toggleWatchMoneyTransferModalVisibility = () => {
        setWatchMoneyTransferHistoryModalVisibility(
            !isWatchMoneyTransferHistoryModalVisible
        );
    };

    const toggleRechargeMoneyModalVisibility = () => {
        setRechargeMoneyModalVisibility(!isRechargeMoneyModalVisible);
    };

    const settingItems = useMemo(
        () => [
            {
                title: 'Tạo tài khoản khách hàng',
                description:
                    'Thêm những thông tin cơ bản của khách hàng, và hệ thống tự phát sinh 01 tài khoản thanh toán cho tài khoản khách hàng',
                actionTitle: 'Tạo tài khoản',
                onItemClick: toggleCreateIdentityModalVisibility,
            },
            {
                title: 'Nạp tiền vào tài khoản',
                description:
                    'Thực hiện thêm tiền trực tiếp vào số dư cho khách hàng.',
                actionTitle: 'Nạp tiền',
                onItemClick: toggleRechargeMoneyModalVisibility,
            },
            {
                title: 'Xem lịch sử giao dịch của 1 tài khoản khách hàng',
                description:
                    'Xem được các giao dịch: Giao dịch nhận tiền, Giao dịch chuyển khoản, Giao dịch thanh toán nhắc nợ, Được sắp xếp từ mới đến cũ, có thể hiện khác nhau cho các loại thanh toán khác nhau',
                actionTitle: 'Xem lịch sử',
                onItemClick: toggleWatchMoneyTransferModalVisibility,
            },
        ],
        []
    );

    const getAllBankAccounts = useCallback(() => {
        const url = `${process.env.REACT_APP_BANK_ACCOUNT_API_URL_PATH}/all`;

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('accessToken'),
            },
        })
            .then((response) => response.json())
            .then((data) => setBankAccounts(data));
    }, []);

    useEffect(() => {
        getAllBankAccounts();
    }, []);

    const handleConfirmRechargeMoney = () => {
        const { bankAccountId, deposit } = rechargeMoneyForm.getFieldsValue();

        const url = `${process.env.REACT_APP_BANK_ACCOUNT_API_URL_PATH}/${bankAccountId}`;
        const payload = {
            deposit,
        };
        fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('accessToken'),
            },
            body: JSON.stringify(payload),
        })
            .then(() => {
                message.success('Successfully');
                getAllBankAccounts();
            })
            .catch((error) => message.error(error));
    };

    const handleCancelRechargeMoney = () => {
        toggleRechargeMoneyModalVisibility(!isRechargeMoneyModalVisible);
        rechargeMoneyForm.resetFields();
    };

    return (
        <EmployeeLayout>
            <CreateIdentityModal
                isVisible={isCreateIdentityModalVisible}
                onToggleVisibilityChange={toggleCreateIdentityModalVisibility}
            />

            <Modal
                title='Nạp tiền tài khoản'
                centered
                open={isRechargeMoneyModalVisible}
                onOk={handleConfirmRechargeMoney}
                onCancel={handleCancelRechargeMoney}>
                <RechargeMoneyForm
                    bankAccounts={bankAccounts}
                    form={rechargeMoneyForm}
                />
            </Modal>

            <Modal
                title='Theo dõi lịch sử giao dịch'
                centered
                open={isWatchMoneyTransferHistoryModalVisible}
                onOk={toggleWatchMoneyTransferModalVisibility}
                onCancel={toggleWatchMoneyTransferModalVisibility}>
                <HistoryTrackingForm bankAccounts={bankAccounts} />
            </Modal>

            <ManagementList sources={settingItems} />
        </EmployeeLayout>
    );
};
