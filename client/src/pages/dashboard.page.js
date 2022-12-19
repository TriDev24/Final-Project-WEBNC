import Title from 'antd/es/typography/Title.js';
import { AppLayout } from '../components/common/index.js';
import styled from '@xstyled/styled-components';
import { Button, Checkbox, message, Modal, Skeleton, Table } from 'antd';
import { ServiceList } from '../components/dashboard/index.js';
import { ContactsOutlined, SwapOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { getProfileFromLocalStorage } from '../utils/local-storage.util.js';
import { BankAccountList } from '../components/dashboard/bank-account-list.component.js';
import { MoneyTransferForm } from '../components/money-transfer/money-transfer-form.component.js';
import { Form } from 'antd';

const GeneralInformationSection = styled.div`
    display: flex;
    justify-content: space-between;
`;

const ServiceSection = styled.div`
    margin: 30px 0px;
`;

const HistorySection = styled.div``;

export const DashBoardPage = () => {
    const [receivers, setReceivers] = useState(null);
    const [bankTypes, setBankTypes] = useState(null);
    const [moneyTransferForm] = Form.useForm();
    const [paymentAccountInfo, setPaymentAccount] = useState(null);
    const [bankAccounts, setBankAccountList] = useState([]);
    const [changeAccountModalVisibility, setChangeAccountModalVisibility] =
        useState(false);
    const [moneyTransferModalVisibility, setMoneyTransferModalVisibility] =
        useState(false);

    useEffect(() => {}, [bankAccounts, paymentAccountInfo]);

    useEffect(() => {
        const getPaymentBankAccount = async () => {
            const apiUrl = `${process.env.REACT_APP_BANK_ACCOUNT_API_URL_PATH}?isPayment=true`;

            await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('accessToken'),
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setPaymentAccount(data[0]);
                    localStorage.setItem(
                        'payment-account-number',
                        data[0].accountNumber
                    );
                });
        };

        const getReceivers = async () => {
            const url = `${
                process.env.REACT_APP_RECEIVER_API_URL_PATH
            }?accountNumber=${localStorage.getItem('payment-account-number')}`;

            fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('accessToken'),
                },
            })
                .then((response) => response.json())
                .then((data) => setReceivers(data));
        };

        const getBankTypes = async () => {
            fetch(process.env.REACT_APP_BANK_TYPE_API_URL_PATH, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('accessToken'),
                },
            })
                .then((response) => response.json())
                .then((data) => setBankTypes(data));
        };

        getReceivers();
        getBankTypes();
        getPaymentBankAccount();
    }, []);

    const handleSelectPaymentAccountClick = (bankAccount) => {
        const url = `${process.env.REACT_APP_BANK_ACCOUNT_API_URL_PATH}/${bankAccount._id}`;
        const data = {
            isPayment: true,
        };

        console.log('aloo');
        fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('accessToken'),
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                localStorage.setItem(
                    'payment-account-number',
                    bankAccount.accountNumber
                );
                message.success('Success');
                setPaymentAccount(bankAccount);
            })
            .catch((error) => message.error(error));
    };

    const toggleChangeAccountModalVisible = () =>
        setChangeAccountModalVisibility(!changeAccountModalVisibility);

    const toggleMoneyTransferModalVisible = () =>
        setMoneyTransferModalVisibility(!moneyTransferModalVisibility);

    const services = [
        {
            icon: <SwapOutlined />,
            name: 'Chuyển tiền',
            onClick: toggleMoneyTransferModalVisible,
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

    const onChangeAccountClick = () => {
        const getBankAccounts = async () => {
            await fetch(process.env.REACT_APP_BANK_ACCOUNT_API_URL_PATH, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('accessToken'),
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setBankAccountList(data);
                });
        };

        getBankAccounts();
        toggleChangeAccountModalVisible();
    };

    const renderGeneralInformation = () =>
        paymentAccountInfo === null ? (
            <Skeleton />
        ) : (
            <>
                <div>
                    <Title level={2}>General Information</Title>
                    <p>Account Number: {paymentAccountInfo.accountNumber}</p>
                    <p>
                        Account Name: {getProfileFromLocalStorage().aliasName}
                    </p>
                    <p>Over Balance: {paymentAccountInfo.overBalance} (VND)</p>
                </div>
                <Button type='primary' onClick={onChangeAccountClick}>
                    Change Account
                </Button>
            </>
        );

    const handleConfirmTransfer = () => {
        const { receiverAccountNumber, bankTypeId, deposit, description } =
            moneyTransferForm.getFieldsValue();

        // validate.
        const payload = {
            senderAccountNumber: localStorage.getItem('payment-account-number'),
            receiverAccountNumber,
            bankTypeId,
            deposit,
            description: description ?? '',
            transferTime: Date.now(),
        };

        fetch(process.env.REACT_APP_BILLING_API_URL_PATH, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('accessToken'),
            },
            body: JSON.stringify(payload),
        })
            .then(() => {
                message.success('Successfully!!!');

                const isNotSavedReceiverBefore =
                    receivers &&
                    !receivers.some(
                        (value) => value.accountNumber === receiverAccountNumber
                    );
                console.log(
                    'isNotSavedReceiverBefore',
                    isNotSavedReceiverBefore
                );

                const savedReceiverCheckbox = isNotSavedReceiverBefore && (
                    <Checkbox id='saveReceiverCheckBox' defaultChecked={false}>
                        Lưu nguời nhận
                    </Checkbox>
                );

                console.log(
                    'isNotSavedReceiverBefore',
                    isNotSavedReceiverBefore
                );
                Modal.info({
                    title: 'Chuyển tiền thành công',
                    content: (
                        <div>
                            <p>
                                <strong>Số tài khoản: </strong>
                                {receiverAccountNumber}
                            </p>
                            <p>
                                <strong>Số tiền: </strong>
                                {deposit}
                            </p>
                            {savedReceiverCheckbox}
                        </div>
                    ),
                    onOk: () => {
                        if (isNotSavedReceiverBefore) {
                            let savedReceiverCheckbox = document.querySelector(
                                '#saveReceiverCheckBox'
                            );
                            var isSaveReceiverChecked =
                                savedReceiverCheckbox.checked === true;

                            if (isSaveReceiverChecked) {
                                const payload = {
                                    senderAccountNumber: localStorage.getItem(
                                        'payment-account-number'
                                    ),
                                    receiverAccountNumber,
                                };

                                fetch(
                                    process.env.REACT_APP_RECEIVER_API_URL_PATH,
                                    {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            Authorization:
                                                localStorage.getItem(
                                                    'accessToken'
                                                ),
                                        },
                                        body: JSON.stringify(payload),
                                    }
                                )
                                    .then((response) =>
                                        message.success(
                                            'Lưu người nhận thành công'
                                        )
                                    )
                                    .catch((error) =>
                                        message.error('Lưu người nhận thất bại')
                                    );

                                savedReceiverCheckbox.checked = false;
                            }
                        }
                    },
                });
            })
            .catch((error) => message.error(error));
    };

    const handleMoneyTransferModalCancel = () => {
        toggleChangeAccountModalVisible();
        moneyTransferForm.resetFields();
    };

    return (
        <AppLayout>
            <Modal
                footer={null}
                title='Bank Accounts'
                open={changeAccountModalVisibility}
                onCancel={handleMoneyTransferModalCancel}>
                <BankAccountList
                    paymentAccount={paymentAccountInfo}
                    onSelectPaymentAccountClick={
                        handleSelectPaymentAccountClick
                    }
                    bankAccounts={bankAccounts}
                />
            </Modal>

            <Modal
                footer={null}
                title='Money Transfer'
                open={moneyTransferModalVisibility}
                onCancel={toggleMoneyTransferModalVisible}>
                <MoneyTransferForm
                    form={moneyTransferForm}
                    receivers={receivers}
                    bankTypes={bankTypes}
                    onConfirmTransfer={handleConfirmTransfer}
                />
            </Modal>

            <GeneralInformationSection>
                {renderGeneralInformation()}
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
