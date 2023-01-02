import React, { useEffect, useState } from 'react';
import { Typography, Table, Modal, Tooltip } from 'antd';
import { Button, Space, message, Tag, Checkbox } from 'antd';
import { PayCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import CreateDebitModal from './create-debit.component.js';
import { styled } from '@xstyled/styled-components';
import OTPInput from '../common/otp-input/index.js';

const { Title } = Typography;

const ContentHeader = styled.div`
    display: flex;
    justify-content: space-between;
`;

const fetchApi = async (side) => {
    const url = `${
        process.env.REACT_APP_DEBIT_URL_PATH
    }?accountNumber=${localStorage.getItem(
        'payment-account-number'
    )}&side=${side}`;

    const result = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            authorization: localStorage.getItem('accessToken'),
        },
    })
        .then((response) => response.json())
        .then((data) => {
            return data.map((value, index) => ({
                key: index,
                id: value._id,
                accountNumber:
                    side === 'personal'
                        ? value.debtAccountId.accountNumber
                        : value.accountId.accountNumber,
                aliasName:
                    side === 'personal'
                        ? value.debtAccountId.identityId.aliasName
                        : value.accountId.identityId.aliasName,
                amountToPay: value.amountToPay,
                content: value.content,
                status: value.statusId.name,
                transferDate: value.transferDate,
                createdAt: new Date(parseInt(value.createdAt)).toLocaleString(),
            }));
        });

    return result;
};

function Action({
    id,
    data,
    setData,
    toggleConfirmOtpModalVisibility,
    side,
    setLoading,
}) {
    const [messageApi, contextHolder] = message.useMessage();
    const deleteDebit = async () => {
        setLoading(true);

        const url = `${process.env.REACT_APP_DEBIT_URL_PATH}/${id}/${side}`;

        const result = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                authorization: localStorage.getItem('accessToken'),
            },
        })
            .then((response) => response.json())
            .then((data) => data);

        await fetchApi(side).then((result) => setData(result));

        setLoading(false);

        if (result.message) {
            messageApi.open({
                type: 'error',
                content: result.message,
            });
        } else {
            messageApi.open({
                type: 'success',
                content: 'Đã hủy nhắc nợ thành công!',
            });
        }
    };

    const payDebit = async () => {
        const foundedDebit = data.find((d) => (d.id = id));
        console.log('foundedDebit', foundedDebit);

        const bankTypes = JSON.parse(localStorage.getItem('bank-types'));
        const internalBankType = bankTypes.find((b) => b.name === 'My Bank');
        const transferMethods = JSON.parse(
            localStorage.getItem('transfer-methods')
        );
        const senderPayFeeMethod = transferMethods.find(
            (t) => t.name === 'Sender Pay Transfer Fee'
        );
        const payload = {
            senderAccountNumber: localStorage.getItem('payment-account-number'),
            receiverAccountNumber: foundedDebit.accountNumber,
            bankTypeId: internalBankType._id,
            deposit: foundedDebit.amountToPay,
            transferMethodId: senderPayFeeMethod._id,
            description: data.content,
            transferTime: Date.now(),
        };
        const result = await fetch(process.env.REACT_APP_BILLING_API_URL_PATH, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: localStorage.getItem('accessToken'),
            },
            body: JSON.stringify(payload),
        })
            .then((response) => response.json())
            .then((data) => {
                toggleConfirmOtpModalVisibility();
                localStorage.setItem('billing-id', data._id);
                localStorage.setItem('paid-debit-id', id);

                fetchApi(side).then((result) => setData(result));
            });
    };

    return (
        <Space>
            {contextHolder}
            {side === 'other' && (
                <Tooltip placement='top' title='Thanh toán'>
                    <Button
                        icon={<PayCircleOutlined />}
                        onClick={payDebit}></Button>
                </Tooltip>
            )}
            <Tooltip placement='top' title='Huỷ'>
                <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={deleteDebit}></Button>
            </Tooltip>
        </Space>
    );
}

function DebitTable({ side }) {
    const [otp, setOtp] = useState('');
    const [confirmOtpModalVisibility, setConfirmOtpModalVisibility] =
        useState(false);
    const [data, setData] = useState([]);
    const [loadingState, setLoading] = useState(true);
    const columns = [
        {
            title: 'Số tài khoản',
            dataIndex: 'accountNumber',
            key: 'accountNumber',
        },
        {
            title: 'Tên tài khoản',
            dataIndex: 'aliasName',
            key: 'aliasName',
        },
        {
            title: 'Số tiền phải trả',
            dataIndex: 'amountToPay',
            key: 'amountToPay',
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            key: 'content',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => {
                if (record.status === 'unpaid')
                    return <Tag color='red'>Chưa thanh toán</Tag>;
                else if (record.status === 'paid')
                    return <Tag color='green'>Đã thanh toán</Tag>;
                else return <Tag type='default'>Đã hủy</Tag>;
            },
        },
        {
            title: 'Ngày trả',
            dataIndex: 'transferDate',
            key: 'transferDate',
            render: (text, record) => (
                <span>
                    {record.transferDate === null
                        ? 'Không có'
                        : new Date(
                              parseInt(record.transferDate)
                          ).toLocaleString()}
                </span>
            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: 'Hành động',
            dataIndex: 'Actions',
            render: (text, record) => {
                return record.status !== 'cancelled' &&
                    record.status !== 'paid' ? (
                    <Action
                        setData={setData}
                        id={record.id}
                        side={side}
                        data={data}
                        toggleConfirmOtpModalVisibility={
                            toggleConfirmOtpModalVisibility
                        }
                        setLoading={setLoading}></Action>
                ) : null;
            },
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            await fetchApi(side).then((result) => setData(result));

            setLoading(false);
        };
        fetchData();
    }, [side]);

    const actions = {
        setData,
        fetchApi,
        setLoading,
    };

    const toggleConfirmOtpModalVisibility = () => {
        setConfirmOtpModalVisibility(!confirmOtpModalVisibility);
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

                updateToPaidDebit();

                fetchApi(side).then((result) => setData(result));
            })
            .catch((error) => {
                message.error(error);
            });
    };

    const updateToPaidDebit = () => {
        const id = localStorage.getItem('paid-debit-id');
        const now = Math.floor(Date.now() / 1000);
        const url = `${process.env.REACT_APP_DEBIT_URL_PATH}/${id}`;
        const payload = {
            isPaid: true,
            payDay: now,
        };

        fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                authorization: localStorage.getItem('accessToken'),
            },
            body: JSON.stringify(payload),
        })
            .then(() => {
                Modal.success('Thanh toán ghi nợ thành công');
            })
            .catch((error) => {
                Modal.error('Có lỗi xảy ra');
            });
    };

    return (
        <>
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
            <ContentHeader>
                <Title level={2}>
                    {side === 'personal'
                        ? 'Nhắc nợ của tôi'
                        : 'Nhắc nợ của người khác'}
                </Title>
                {side === 'personal' && <CreateDebitModal actions={actions} />}
            </ContentHeader>
            <Table loading={loadingState} columns={columns} dataSource={data} />
        </>
    );
}

export default DebitTable;
