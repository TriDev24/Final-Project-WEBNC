import { styled } from '@xstyled/styled-components';
import { Button, Form, Input, Select, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import { Collapse } from 'antd';
import { ReceiverItem } from './receiver-item.component.js';

const { Panel } = Collapse;

const { Option } = Select;

const Container = styled.div`
    margin: 20px 10px;
`;

export const MoneyTransferForm = () => {
    const [form] = Form.useForm();
    const [receivers, setReceivers] = useState(null);
    const [bankTypes, setBankTypes] = useState(null);

    useEffect(() => {
        const getReceivers = async () => {
            fetch(process.env.REACT_APP_RECEIVER_API_URL_PATH, {
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
    }, []);

    const onConfirmTransfer = () => {
        console.log(form.getFieldsValue());
    };

    const renderReceiverOptions = () =>
        receivers === null ? (
            <Skeleton />
        ) : (
            receivers.map((r) => <ReceiverItem receiver={r} />)
        );

    const renderBankTypeOptions = () =>
        bankTypes === null ? (
            <Skeleton />
        ) : (
            bankTypes.map((b) => <Option key={b._id}>{b.name}</Option>)
        );

    return (
        <Container>
            <Form form={form} layout='vertical'>
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
                    name='bankType'
                    label='Bank Type'
                    rules={[
                        {
                            required: true,
                            message: 'Please select bank type',
                        },
                    ]}>
                    <Select>{renderBankTypeOptions()}</Select>
                </Form.Item>
                <Form.Item>
                    <Collapse defaultActiveKey={['1']}>
                        <Panel header='Or select saved receivers' key='1'>
                            {renderReceiverOptions()}
                        </Panel>
                    </Collapse>
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
                <Form.Item name='description' label='Description'>
                    <Input placeholder='Example: Pay for coffee' />
                </Form.Item>

                <Button type='primary' block onClick={onConfirmTransfer}>
                    Xác nhận
                </Button>
            </Form>
        </Container>
    );
};
