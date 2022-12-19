import { styled } from '@xstyled/styled-components';
import { Button, Form, Input, InputNumber, Select, Skeleton } from 'antd';
import { Collapse } from 'antd';
import { ReceiverItem } from './receiver-item.component.js';

const { Panel } = Collapse;

const { Option } = Select;

const Container = styled.div`
    margin: 20px 10px;
`;

const StyledDepositInput = styled(InputNumber)`
    width: 100%;
`;

export const MoneyTransferForm = ({
    form,
    receivers,
    bankTypes,
    onConfirmTransfer,
}) => {
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
                    name='receiverAccountNumber'
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
                    name='bankTypeId'
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
                    <StyledDepositInput
                        addonAfter='VNĐ'
                        placeholder='Example: 200000'
                    />
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
