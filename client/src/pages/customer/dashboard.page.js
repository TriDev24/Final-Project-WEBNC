import Title from 'antd/es/typography/Title.js';
import { CustomerLayout } from '../../components/common/customer-layout.component.js';
import styled from '@xstyled/styled-components';
import { Button, Checkbox, message, Modal, Input, Skeleton, Table } from 'antd';
import { ServiceList } from '../../components/dashboard/service-list.component.js';
import { SwapOutlined } from '@ant-design/icons';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { BankAccountList } from '../../components/dashboard/bank-account-list.component.js';
import { MoneyTransferForm } from '../../components/money-transfer/money-transfer-form.component.js';
import { Form } from 'antd';
import OTPInput from '../../components/common/otp-input/index.js';
import { useStore, actions } from '../../store';

const GeneralInformationSection = styled.div`
    display: flex;
    justify-content: space-between;
`;

const ServiceSection = styled.div`
    margin: 30px 0px;
`;

const HistorySection = styled.div``;

export const CustomerDashBoardPage = () => {
    const [state, dispatch] = useStore();
    const [paymentAccountHistory, setPaymentAccountHistory] = useState(null);
    const { profile, paymentAccountNumber, bankTypes, transferMethods } = state;
    const [receivers, setReceivers] = useState(null);
    const [moneyTransferForm] = Form.useForm();
    const [paymentAccountInfo, setPaymentAccount] = useState(null);
    const [bankAccounts, setBankAccountList] = useState([]);
    const [changeAccountModalVisibility, setChangeAccountModalVisibility] =
        useState(false);
    const [confirmOtpModalVisibility, setConfirmOtpModalVisibility] =
        useState(false);
    const [moneyTransferModalVisibility, setMoneyTransferModalVisibility] =
        useState(false);
    const [otp, setOtp] = useState('');
    const [addReceiverForm] = Form.useForm();

    const handleAddReceiver = () => {
        Modal.confirm({
            title: 'Thêm người nhận',
            content: (
                <Form layout='vertical'>
                    <Form.Item
                        name='receiverAccountNumber'
                        label='Số tài khoản'>
                        <Input placeholder='VD: 512315123' />
                    </Form.Item>
                    <Form.Item name='aliasName' label='Tên thường gọi'>
                        <Input placeholder='VD: Văn A' />
                    </Form.Item>
                </Form>
            ),
            okText: 'Xác nhận',
            cancelText: 'Huỷ',
            onOk: () => {
                const { aliasName, receiverAccountNumber } =
                    addReceiverForm.getFieldsValue();
                const payload = {
                    senderAccountNumber: localStorage.getItem(
                        'payment-account-number'
                    ),
                    receiverAccountNumber,
                    aliasName,
                };

                fetch(process.env.REACT_APP_RECEIVER_API_URL_PATH, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: localStorage.getItem('accessToken'),
                    },
                    body: JSON.stringify(payload),
                })
                    .then(() => {
                        message.success('Thêm người nhận thành công');
                    })
                    .catch(() => {
                        message.error('Thêm người nhận thất bại');
                    });
            },
        });
    };

    const toggleConfirmOtpModalVisibility = () => {
        setConfirmOtpModalVisibility(!confirmOtpModalVisibility);
    };

    useEffect(() => {
        getPaymentBankAccount();
    }, [bankAccounts]);

    useEffect(() => {
        const getBankTypes = async () => {
            fetch(process.env.REACT_APP_BANK_TYPE_API_URL_PATH, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('accessToken'),
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    dispatch(actions.setBankTypes(data));
                });
        };

        const getTransferMethods = async () => {
            fetch(process.env.REACT_APP_TRANSFER_METHOD_API_URL_PATH, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('accessToken'),
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    dispatch(actions.setTransferMethods(data));
                });
        };

        getBankTypes();
        getTransferMethods();
    }, []);

    useEffect(() => {
        getReceivers();
        getPaymentBankAccountHistory();
    }, [paymentAccountInfo]);

    const getPaymentBankAccount = useCallback(() => {
        const apiUrl = `${process.env.REACT_APP_BANK_ACCOUNT_API_URL_PATH}?isPayment=true`;

        fetch(apiUrl, {
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
                dispatch(
                    actions.setPaymentAccountNumber(
                        localStorage.getItem('payment-account-number')
                    )
                );
            });
    }, []);

    const getReceivers = useCallback(() => {
        const url = `${process.env.REACT_APP_RECEIVER_API_URL_PATH}?accountNumber=${paymentAccountNumber}`;

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('accessToken'),
            },
        })
            .then((response) => response.json())
            .then((data) => setReceivers(data));
    }, []);

    const getPaymentBankAccountHistory = useCallback(() => {
        const paymentAccountNumber = localStorage.getItem(
            'payment-account-number'
        );
        if (paymentAccountNumber) {
            const url = `${process.env.REACT_APP_BILLING_API_URL_PATH}/payment-account-history?accountNumber=${paymentAccountNumber}`;
            fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('accessToken'),
                },
            })
                .then((response) => response.json())
                .then((data) => setPaymentAccountHistory(data));
        }
    }, []);

    const handleDeleteReceiverClick = (receiverId) => {
        Modal.confirm({
            title: 'Bạn có chắc muốn xoá người nhận này không?',
            okText: 'Có',
            cancelText: 'Không',
            onOk: () => {
                const url = `${process.env.REACT_APP_RECEIVER_API_URL_PATH}/${receiverId}`;
                fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: localStorage.getItem('accessToken'),
                    },
                })
                    .then(() => {
                        message.success('Xoá thành công');
                        getReceivers();
                    })
                    .catch((err) => {
                        message.error('Đã có lỗi xảy ra. Vui lòng thử lại');
                    });
            },
        });
    };

    const handleSelectPaymentAccountClick = (bankAccount) => {
        const url = `${process.env.REACT_APP_BANK_ACCOUNT_API_URL_PATH}/${bankAccount._id}`;
        const data = {
            isPayment: true,
        };

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
                dispatch(
                    actions.setPaymentAccountNumber(
                        localStorage.getItem('payment-account-number')
                    )
                );
                message.success('Thay đổi tài khoản thành công');
                setPaymentAccount(bankAccount);
                getReceivers();
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
    ];

    const historyColumns = useMemo(
        () => [
            {
                title: 'Số tài khoản gửi',
                dataIndex: 'senderAccountNumber',
                key: 'senderAccountNumber',
            },
            {
                title: 'Số tài khoản nhận',
                dataIndex: 'receiverAccountNumber',
                key: 'receiverAccountNumber',
            },
            {
                title: 'Số tiền(VNĐ)',
                dataIndex: 'transferMoney',
                key: 'transferMoney',
            },
            {
                title: 'Nội dung',
                dataIndex: 'description',
                key: 'description',
            },
            {
                title: 'Ngày giao dịch',
                dataIndex: 'transferTime',
                key: 'transferTime',
                render: (transferTime) =>
                    new Date(parseInt(transferTime)).toLocaleString(),
            },
        ],
        []
    );

    const renderPaymentAccountHistoryTable = () => {
        if (!paymentAccountHistory) {
            return <Skeleton />;
        } else {
            // Nhan tien
            const receiveBillings = paymentAccountHistory.filter(
                (p) => p.type === 'receive'
            );
            const mappedReceiveBillingDataSource = receiveBillings.map((r) => {
                return {
                    senderAccountNumber: r.sender.accountNumber,
                    receiverAccountNumber: 'Tôi',
                    transferMoney: r.deposit,
                    description: r.description,
                    transferTime: r.transferTime,
                };
            });

            // Chuyen tien
            const transferBillings = paymentAccountHistory.filter(
                (p) => p.type === 'transfer'
            );
            const mappedTransferBillingDataSource = transferBillings.map(
                (t) => {
                    return {
                        senderAccountNumber: 'Tôi',
                        receiverAccountNumber: t.receiver.accountNumber,
                        transferMoney: t.deposit,
                        description: t.description,
                        transferTime: t.transferTime,
                    };
                }
            );

            // Nhac no
            const debitBillings = paymentAccountHistory.filter(
                (p) => p.type === 'debit'
            );
            const mappedDebitBillingDataSource = debitBillings.map((d) => {
                return {
                    senderAccountNumber: 'Tôi',
                    receiverAccountNumber: d.receiver.accountNumber,
                    transferMoney: d.deposit,
                    description: d.description,
                    transferTime: d.transferTime,
                };
            });

            return (
                <>
                    <p>
                        <strong>
                            <i>Giao dịch nhận tiền</i>
                        </strong>
                    </p>
                    <Table
                        columns={historyColumns}
                        dataSource={mappedReceiveBillingDataSource}
                    />
                    <p>
                        <strong>
                            <i>Giao dịch chuyển tiền</i>
                        </strong>
                    </p>
                    <Table
                        columns={historyColumns}
                        dataSource={mappedTransferBillingDataSource}
                    />
                    <p>
                        <strong>
                            <i>Giao dịch thanh toán nhắc nợ</i>
                        </strong>
                    </p>
                    <Table
                        columns={historyColumns}
                        dataSource={mappedDebitBillingDataSource}
                    />
                </>
            );
        }
    };

    const getBankAccounts = useCallback(() => {
        fetch(process.env.REACT_APP_BANK_ACCOUNT_API_URL_PATH, {
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
    }, []);

    const handleChangeAccountClick = () => {
        getBankAccounts();
        toggleChangeAccountModalVisible();

        getPaymentBankAccount();
    };

    const renderGeneralInformation = () =>
        paymentAccountInfo === null ? (
            <Skeleton />
        ) : (
            <>
                <div>
                    <Title level={2}>Thông tin chung</Title>
                    <p>Số tài khoản: {paymentAccountInfo.accountNumber}</p>
                    <p>Chủ tài khoản: {profile.aliasName}</p>
                    <p>Số dư: {paymentAccountInfo.overBalance} (VNĐ)</p>
                </div>
                <Button type='primary' onClick={handleChangeAccountClick}>
                    Thay đổi tài khoản
                </Button>
            </>
        );

    const handleConfirmTransfer = () => {
        const {
            receiverAccountNumber,
            bankTypeId,
            deposit,
            transferMethodId,
            description,
        } = moneyTransferForm.getFieldsValue();

        // validate.
        const payload = {
            senderAccountNumber: localStorage.getItem('payment-account-number'),
            receiverAccountNumber,
            bankTypeId,
            deposit,
            transferMethodId,
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
            .then((response) => response.json())
            .then((data) => {
                message.success('Successfully!!!');

                const isNotSavedReceiverBefore = receivers.every((value) => {
                    return value.accountNumber !== receiverAccountNumber;
                });

                localStorage.setItem(
                    'is-not-saved-receiver-before',
                    isNotSavedReceiverBefore
                );
                localStorage.setItem(
                    'current-receiver-account-number',
                    receiverAccountNumber
                );

                toggleConfirmOtpModalVisibility();
                localStorage.setItem('billing-id', data._id);
            })
            .catch((error) => message.error(error));
    };

    const handleConfirmOtp = () => {
        const url = `${
            process.env.REACT_APP_BILLING_API_URL_PATH
        }/${localStorage.getItem('billing-id')}/verify-otp`;
        const payload = {
            otp,
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('accessToken'),
            },
            body: JSON.stringify(payload),
        })
            .then(() => {
                message.success('Successfully');
                toggleConfirmOtpModalVisibility();
                getPaymentBankAccountHistory();

                // Show Success Modal.
                const isNotSavedReceiverBefore = JSON.parse(
                    localStorage.getItem('is-not-saved-receiver-before')
                );
                console.log(
                    'isNotSavedReceiverBefore',
                    isNotSavedReceiverBefore
                );

                Modal.success({
                    title: 'Thành công',
                    content: (
                        <>
                            {isNotSavedReceiverBefore && (
                                <Checkbox
                                    id='saveReceiverCheckBox'
                                    defaultChecked={false}>
                                    Lưu nguời nhận
                                </Checkbox>
                            )}
                        </>
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
                                    receiverAccountNumber: localStorage.getItem(
                                        'current-receiver-account-number'
                                    ),
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
                                    .then((response) => {
                                        message.success(
                                            'Lưu người nhận thành công'
                                        );
                                        getReceivers();
                                    })
                                    .catch((error) =>
                                        message.error('Lưu người nhận thất bại')
                                    );

                                savedReceiverCheckbox.checked = false;
                            }
                        }

                        moneyTransferForm.resetFields();
                        setOtp('');
                    },
                });
            })
            .catch((error) => {
                message.error(error);
            });
    };

    const handleMoneyTransferModalCancel = () => {
        toggleMoneyTransferModalVisible();
        moneyTransferForm.resetFields();
    };

    return (
        <CustomerLayout>
            <Modal
                title='Xác nhận giao dịch'
                centered
                okText='Xác nhận'
                cancelText='Huỷ'
                onOk={handleConfirmOtp}
                onCancel={toggleConfirmOtpModalVisibility}
                open={confirmOtpModalVisibility}>
                <OTPInput
                    autoFocus
                    length={4}
                    onChangeOTP={(value) => {
                        setOtp(value);
                    }}
                />
            </Modal>

            <Modal
                footer={null}
                title='Tài khoản ngân hàng'
                open={changeAccountModalVisibility}
                onCancel={toggleChangeAccountModalVisible}>
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
                title='Chuyển khoản'
                open={moneyTransferModalVisibility}
                onCancel={handleMoneyTransferModalCancel}>
                <MoneyTransferForm
                    form={moneyTransferForm}
                    receivers={receivers}
                    bankTypes={bankTypes}
                    onAddReceiver={handleAddReceiver}
                    transferMethods={transferMethods}
                    onDeleteReceiverClick={handleDeleteReceiverClick}
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
                <Title level={2}>Lịch sử giao dịch (trong 30 ngày qua)</Title>
                {renderPaymentAccountHistoryTable()}
            </HistorySection>
        </CustomerLayout>
    );
};
