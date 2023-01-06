import React, { useEffect, useState } from 'react';
import { InputNumber, Form, Skeleton, Select, Input } from 'antd';
import { styled } from '@xstyled/styled-components';
import {
    LockOutlined,
    UserOutlined,
    ProfileOutlined,
    PhoneOutlined,
    MailOutlined,
} from '@ant-design/icons';

const { Option } = Select;

const StyledDepositInput = styled(InputNumber)`
    width: 100%;
`;

const BankAccountItem = styled.div`
    margin: 1px 0;
`;

const StyledSelect = styled(Select)``;

export const CreateEmployeeForm = ({}) => {
    return (
        <Form layout='vertical'>
            <Form.Item
                label='Email'
                name='emailEmployee'
                rules={[
                    {
                        required: true,
                        message: 'Mời bạn nhập email nhân viên mới!!!',
                    },
                ]}>
                <Input
                    prefix={<MailOutlined className='site-form-item-icon' />}
                    placeholder='Email'
                />
            </Form.Item>
            <Form.Item
                label='Password'
                name='passEmployee'
                rules={[
                    {
                        required: true,
                        message: 'Mời bạn nhập password nhân viên mới!!!',
                    },
                ]}>
                <Input
                    prefix={<LockOutlined className='site-form-item-icon' />}
                    placeholder='Password'
                />
            </Form.Item>
            <Form.Item
                label='Tên nhân viên'
                name='firstNameEmployee'
                rules={[
                    {
                        required: true,
                        message: 'Mời bạn nhập tên nhân viên mới!!!',
                    },
                ]}>
                <Input
                    prefix={<UserOutlined className='site-form-item-icon' />}
                    placeholder='Tên nhân viên'
                />
            </Form.Item>
            <Form.Item
                label='Họ nhân viên'
                name='lastNameEmployee'
                rules={[
                    {
                        required: true,
                        message: 'Mời bạn nhập họ nhân viên mới!!!',
                    },
                ]}>
                <Input
                    prefix={<UserOutlined className='site-form-item-icon' />}
                    placeholder='Họ nhân viên'
                />
            </Form.Item>
            <Form.Item
                label='Số điện thoại'
                name='phoneNumberEmployee'
                rules={[
                    {
                        required: true,
                        message: 'Mời bạn nhập số điện thoại nhân viên mới!!!',
                    },
                ]}>
                <Input
                    prefix={<PhoneOutlined className='site-form-item-icon' />}
                    placeholder='Số điện thoại'
                />
            </Form.Item>
        </Form>
    );
};
