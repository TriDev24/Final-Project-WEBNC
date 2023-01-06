import { Modal, Form, message } from 'antd';
import { useMemo, useEffect, useState, useCallback } from 'react';
import { EmployeeLayout } from '../../components/common/employee-layout.component.js';
import { ManagementList } from '../../components/management-list.component.js';
import { CreateIdentityModal } from '../../components/create-identity.component.js';
import { RechargeMoneyForm } from '../../components/recharge-money-form.component.js';
import { HistoryTrackingForm } from '../../components/history-tracking-form.component.js';
import { AddBankAccountForm } from '../../components/add-bank-account-form.component.js';

export const EmployeeDashboardPage = ({ setAuth }) => {
    const [bankAccounts, setBankAccounts] = useState(null);
    const [customers, setCustomers] = useState(null);
    const [addBankAccountForm] = Form.useForm();
    const [isCreateIdentityModalVisible, setCreateIdentityModalVisibility] =
        useState(false);
    const [rechargeMoneyForm] = Form.useForm();
    const [isRechargeMoneyModalVisible, setRechargeMoneyModalVisibility] =
        useState(false);
    const [
        isWatchMoneyTransferHistoryModalVisible,
        setWatchMoneyTransferHistoryModalVisibility,
    ] = useState(false);
    const [isAddBankAccountModalVisible, setAddBankAccountModalVisibility] =
        useState(false);

    const toggleCreateIdentityModalVisibility = () => {
        setCreateIdentityModalVisibility(!isCreateIdentityModalVisible);
    };

    const toggleWatchMoneyTransferModalVisibility = () => {
        setWatchMoneyTransferHistoryModalVisibility(
            !isWatchMoneyTransferHistoryModalVisible
        );
    };

    const toggleAddBankAccountModalVisibility = () => {
        setAddBankAccountModalVisibility(!isAddBankAccountModalVisible);
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
                title: 'Tạo tài khoản thanh toán cho khách hàng',
                description: 'Tạo mới một tài khoản thanh toán cho người dùng.',
                actionTitle: 'Thêm mới',
                onItemClick: toggleAddBankAccountModalVisibility,
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

    const getAllCustomers = useCallback(() => {
        const url = `${process.env.REACT_APP_USER_API_URL_PATH}?role=customer`;

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('accessToken'),
            },
        })
            .then((response) => response.json())
            .then((data) => setCustomers(data));
    }, []);

    useEffect(() => {
        getAllBankAccounts();
        getAllCustomers();
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
                message.success('Nạp tiền thành công!!!');
                rechargeMoneyForm.resetFields();
                getAllBankAccounts();
            })
            .catch((error) => message.error(error));
    };

    const handleCancelRechargeMoney = () => {
        toggleRechargeMoneyModalVisibility(!isRechargeMoneyModalVisible);
        rechargeMoneyForm.resetFields();
    };

    const handleConfirmAddBankAccount = () => {
        const { identityId } = addBankAccountForm.getFieldsValue();
        const payload = {
            identityId,
        };

        fetch(process.env.REACT_APP_BANK_ACCOUNT_API_URL_PATH, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('accessToken'),
            },
            body: JSON.stringify(payload),
        })
            .then((response) => response.json())
            .then((value) => {
                message.success('Tạo tài khoản thành công');
                console.log('bank account moi tao: ', value);
                Modal.confirm({
                    title: 'Thành công',
                    content: (
                        <div>
                            <p>
                                <strong>Số tài khoản: </strong>
                                {value.accountNumber}
                            </p>
                        </div>
                    ),
                });
            })
            .catch((error) => {
                message.error('Đã có lỗi xảy ra');
            });
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
                title='Thêm mới tài khoản thanh toán'
                centered
                open={isAddBankAccountModalVisible}
                onOk={handleConfirmAddBankAccount}
                onCancel={toggleAddBankAccountModalVisibility}>
                <AddBankAccountForm
                    form={addBankAccountForm}
                    customers={customers}
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
