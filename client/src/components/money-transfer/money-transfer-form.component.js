import { styled } from '@xstyled/styled-components';
import { Form } from 'antd';
import { useEffect } from 'react';

export const MoneyTransferForm = () => {
    const [form] = Form.useForm();

    useEffect(() => {
        const getReceivers = async () => {
            await fetch(process.env.REACT_APP_RECEIVER_API_URL_PATH, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('accessToken'),
                },
            });
        };

        getReceivers();
    });

    return (
        <Form layout='vertical'>
            <Form.Item
                name='accountNumber'
                label='Account Number'
                rules={[
                    {
                        required: true,
                        message: 'Please input account number',
                    },
                ]}>
                <Input placeholder='Example: 012345678910' />
            </Form.Item>
            <Form.Item
                name='deposit'
                label='Deposit'
                rules={[
                    {
                        required: true,
                        message: 'Please input deposits',
                    },
                ]}>
                <Input placeholder='Example: 200000' />
            </Form.Item>
        </Form>
    );
};
