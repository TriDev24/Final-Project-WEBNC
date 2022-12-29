import React, { useEffect, useState } from 'react';
import { InputNumber, Form, Skeleton, Select } from 'antd';
import { styled } from '@xstyled/styled-components';

const { Option } = Select;

const StyledDepositInput = styled(InputNumber)`
    width: 100%;
`;

const BankAccountItem = styled.div`
    margin: 1px 0;
`;

const StyledSelect = styled(Select)``;

export const RechargeMoneyForm = ({ form, bankAccounts }) => {
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

    return (
        <Form layout='vertical' form={form}>
            <Form.Item
                label='Bank Account Number'
                name='bankAccountId'
                rules={[
                    {
                        required: true,
                        message:
                            'Mời bạn nhập tài khoản người dùng cần nạp tiền!!!',
                    },
                ]}>
                <StyledSelect placeholder='Chọn 1 tài khoản để nạp'>
                    {renderBankAccountOptions()}
                </StyledSelect>
            </Form.Item>

            <Form.Item
                label='Transfer Amount'
                name='deposit'
                rules={[
                    {
                        required: true,
                        message: 'Mời bạn nhập số tiền chuyển!',
                    },
                ]}>
                <StyledDepositInput
                    addonAfter='VNĐ'
                    decimalSeparator=','
                    min={0}
                    max={10000000000}
                    placeholder='Ví dụ: 200000'
                />
            </Form.Item>
        </Form>
    );
};
