import React, { useMemo, useState } from 'react';
import { Skeleton, Select, Table, message } from 'antd';
import { styled } from '@xstyled/styled-components';
import { convertUnixTimestampToDateTime } from '../utils/date-time.util.js';
import Paragraph from 'antd/es/typography/Paragraph.js';

const { Option } = Select;

const Container = styled.div`
    overflow: auto;
`;

const BankAccountItem = styled.div`
    margin: 1px 0;
`;

const StyledParagraph = styled.p`
    margin-top: 10px;
`;

const StyledSelect = styled(Select)`
    width: 100%;
`;

export const HistoryTrackingForm = ({ bankAccounts }) => {
    const [history, setHistory] = useState({});
    const [isTriggerChangeBankAccount, setTriggerChangeBankAccountStatus] =
        useState(false);

    // Get Receive
    const receiveBillingTableColumns = useMemo(
        () => [
            {
                title: 'Người gửi',
                key: 'senderName',
                dataIndex: 'senderName',
            },
            {
                title: 'Số tài khoản',
                key: 'senderAccountNumber',
                dataIndex: 'senderAccountNumber',
            },
            {
                title: 'Tổng số tiền (VNĐ)',
                key: 'totalAmount',
                dataIndex: 'totalAmount',
            },
            {
                title: 'Thời điểm chuyển khoản',
                key: 'transferTime',
                dataIndex: 'transferTime',
            },
        ],
        []
    );
    const getReceiveBillingDataSource = (receives) => {
        if (!receives) {
            return [];
        }

        return receives.map((r) => {
            return {
                senderName: r.sender.name,
                senderAccountNumber: r.sender.accountNumber,
                totalAmount: r.totalAmount,
                transferTime: convertUnixTimestampToDateTime(r.transferTime),
            };
        });
    };

    // Get Transfer
    const transferBillingTableColumns = useMemo(
        () => [
            {
                title: 'Người nhận',
                key: 'receiverName',
                dataIndex: 'receiverName',
            },
            {
                title: 'Số tài khoản',
                key: 'receiverAccountNumber',
                dataIndex: 'receiverAccountNumber',
            },
            {
                title: 'Tổng số tiền (VNĐ)',
                key: 'totalAmount',
                dataIndex: 'totalAmount',
            },
            {
                title: 'Thời điểm chuyển khoản',
                key: 'transferTime',
                dataIndex: 'transferTime',
            },
        ],
        []
    );
    const getTransferBillingDataSource = (transfers) => {
        if (!transfers) {
            return [];
        }

        return transfers.map((t) => {
            return {
                receiverName: t.receiver.name,
                receiverAccountNumber: t.receiver.accountNumber,
                totalAmount: t.totalAmount,
                transferTime: convertUnixTimestampToDateTime(t.transferTime),
            };
        });
    };

    // Get Debit
    const debitBillingTableColumns = useMemo(
        () => [
            {
                title: 'Người nhận',
                key: 'receiverName',
                dataIndex: 'receiverName',
            },
            {
                title: 'Số tài khoản',
                key: 'receiverAccountNumber',
                dataIndex: 'receiverAccountNumber',
            },
            {
                title: 'Tổng số tiền (VNĐ)',
                key: 'totalAmount',
                dataIndex: 'totalAmount',
            },
            {
                title: 'Thời điểm chuyển khoản',
                key: 'transferTime',
                dataIndex: 'transferTime',
            },
        ],
        []
    );
    const getDebitBillingDataSource = (debits) => {
        if (!debits) {
            return [];
        }

        return debits.map((d) => {
            return {
                senderName: d.sender.name,
                senderAccountNumber: d.sender.accountNumber,
                totalAmount: d.totalAmount,
                transferTime: convertUnixTimestampToDateTime(d.transferTime),
            };
        });
    };

    const renderBankAccountOptions = () => {
        return (
            <>
                {bankAccounts === null ? (
                    <Skeleton />
                ) : (
                    bankAccounts.map((b) => (
                        <Option key={b._id}>
                            <BankAccountItem>
                                <strong>
                                    Chủ tài khoản: {b.identity.aliasName}
                                </strong>
                                <div>Số tài khoản: {b.accountNumber}</div>
                                <div>Số dư hiện tại: {b.overBalance}(VNĐ)</div>
                            </BankAccountItem>
                        </Option>
                    ))
                )}
            </>
        );
    };

    const handleSelectChange = (value) => {
        setTriggerChangeBankAccountStatus(true);

        const url = `${process.env.REACT_APP_BILLING_API_URL_PATH}/history?bankAccountId=${value}`;
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('accessToken'),
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setHistory(data);
                setTriggerChangeBankAccountStatus(false);
            })
            .catch((error) => message.error(error));
    };

    const renderReceiveBillingTable = () => {
        return (
            <>
                {isTriggerChangeBankAccount &&
                isTriggerChangeBankAccount === true ? (
                    <Skeleton />
                ) : (
                    <Table
                        columns={receiveBillingTableColumns}
                        dataSource={getReceiveBillingDataSource(
                            history.receives
                        )}
                    />
                )}
            </>
        );
    };

    const renderTransferBillingTable = () => {
        return (
            <>
                {isTriggerChangeBankAccount &&
                isTriggerChangeBankAccount === true ? (
                    <Skeleton />
                ) : (
                    <Table
                        columns={transferBillingTableColumns}
                        dataSource={getTransferBillingDataSource(
                            history.transfers
                        )}
                    />
                )}
            </>
        );
    };

    const renderDebitBillingTable = () => {
        return (
            <>
                {isTriggerChangeBankAccount &&
                isTriggerChangeBankAccount === true ? (
                    <Skeleton />
                ) : (
                    <Table
                        columns={debitBillingTableColumns}
                        dataSource={getDebitBillingDataSource(history.debits)}
                    />
                )}
            </>
        );
    };

    return (
        <Container>
            <StyledSelect
                placeholder='Chọn 1 tài khoản để xem'
                onChange={handleSelectChange}>
                {renderBankAccountOptions()}
            </StyledSelect>

            <StyledParagraph>
                <strong>Giao dịch nhận tiền</strong>
            </StyledParagraph>
            {renderReceiveBillingTable()}

            <StyledParagraph>
                <strong>Giao dịch chuyển tiền</strong>
            </StyledParagraph>
            {renderTransferBillingTable()}

            <StyledParagraph>
                <strong>Giao dịch thanh toán nhắc nợ</strong>
            </StyledParagraph>
            {renderDebitBillingTable()}
        </Container>
    );
};
