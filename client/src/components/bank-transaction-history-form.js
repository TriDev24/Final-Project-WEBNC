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

export const BankTransactionHistoryForm = ({ }) => {
    const [history, setHistory] = useState({});
    const [isTriggerChangeBankAccount, setTriggerChangeBankAccountStatus] =
        useState(false);

    // Get Receive
    const receiveBillingTableColumns = useMemo(
        () => [
            {
                title: 'Ngân hàng gửi',
                key: 'senderBankName',
                dataIndex: 'senderName',
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
                title: 'Ngân hàng nhận',
                key: 'receiverBankName',
                dataIndex: 'receiverBankName',
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

    return (
        <Container>
            <StyledParagraph>
                <strong>Giao dịch nhận tiền</strong>
            </StyledParagraph>
            {renderReceiveBillingTable()}

            <StyledParagraph>
                <strong>Giao dịch chuyển tiền</strong>
            </StyledParagraph>
            {renderTransferBillingTable()}
        </Container>
    );
};
