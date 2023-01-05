import { DeleteOutlined, PlusCircleFilled } from '@ant-design/icons';
import { styled } from '@xstyled/styled-components';
import {
    Button,
    Form,
    Input,
    InputNumber,
    Modal,
    Radio,
    Select,
    Skeleton,
    Space,
    Collapse,
    Tooltip,
} from 'antd';
import { ReceiverItem } from './receiver-item.component.js';

const { Panel } = Collapse;

const { Option } = Select;

const Container = styled.div`
    margin: 20px 10px;
`;

const StyledDepositInput = styled(InputNumber)`
    width: 100%;
`;

const FlexLayout = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const ReceiverItemContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 4px;
    padding: 10px 0;

    &:hover {
        background: lightgray;
        cursor: pointer;
        transition: background 0.25s;
    }
`;

const ActionFields = styled(Space)`
    margin: 0 5px;
`;

export const MoneyTransferForm = ({
    form,
    receivers,
    bankTypes,
    transferMethods,
    onAddReceiver,
    onDeleteReceiverClick,
    onConfirmTransfer,
}) => {
    const handleReceiverItemClick = (receiver) => {
        form.setFieldsValue({
            receiverAccountNumber: receiver.accountNumber,
            bankTypeId: receiver.bankType.id,
        });
    };

    const renderReceiverOptions = () =>
        receivers === null ? (
            <Skeleton />
        ) : (
            receivers.map((r) => (
                <ReceiverItemContainer>
                    <ReceiverItem
                        onSelectItemClick={handleReceiverItemClick}
                        receiver={r}
                    />
                    <ActionFields direction='horizontal'>
                        <Button
                            type='text'
                            onClick={() => onDeleteReceiverClick(r._id)}
                            icon={<DeleteOutlined />}
                        />
                    </ActionFields>
                </ReceiverItemContainer>
            ))
        );

    const renderBankTypeOptions = () =>
        bankTypes === null ? (
            <Skeleton />
        ) : (
            bankTypes.map((b) => <Option key={b._id}>{b.name}</Option>)
        );
    const renderTransferMethodOptions = () =>
        transferMethods === null ? (
            <Skeleton />
        ) : (
            transferMethods.map((t) => (
                <Radio value={t._id}>
                    {t.name === 'Sender Pay Transfer Fee'
                        ? 'Người gửi thanh toán'
                        : 'Người nhận thanh toán'}
                </Radio>
            ))
        );

    return (
        <Container>
            <Modal></Modal>
            <Form form={form} layout='vertical'>
                <Form.Item
                    name='receiverAccountNumber'
                    label='Số tài khoản người nhận'
                    rules={[
                        {
                            required: true,
                            message: 'Mời bạn nhập số tài khoản của người nhận',
                        },
                    ]}>
                    <Input placeholder='Ví dụ: 012345678910' />
                </Form.Item>
                <Form.Item
                    name='bankTypeId'
                    label='Loại ngân hàng'
                    rules={[
                        {
                            required: true,
                            message: 'Mời bạn chọn loại ngân hàng',
                        },
                    ]}>
                    <Select placeholder='Vui lòng chọn 1 ngân hàng cần chuyển'>
                        {renderBankTypeOptions()}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Collapse defaultActiveKey={['1']}>
                        <Panel
                            header='Hoặc chọn người nhận từ danh sách đã lưu'
                            extra={
                                <Tooltip title='Thêm người nhận mới'>
                                    <Button
                                        type='text'
                                        icon={<PlusCircleFilled />}
                                        onClick={onAddReceiver}
                                    />
                                </Tooltip>
                            }
                            key='1'>
                            {renderReceiverOptions()}
                        </Panel>
                    </Collapse>
                </Form.Item>

                <Form.Item
                    name='deposit'
                    label='Số tiền chuyển'
                    rules={[
                        {
                            required: true,
                            message: 'Mời bạn nhập số tiền cần chuyển',
                        },
                    ]}>
                    <StyledDepositInput
                        addonAfter='VNĐ'
                        placeholder='Ví dụ: 200000'
                    />
                </Form.Item>
                <Form.Item
                    name='transferMethodId'
                    label='Hình thức thanh toán phí'
                    rules={[
                        {
                            required: true,
                            message: 'Mời bạn chọn hình thức thanh toán phí',
                        },
                    ]}>
                    <Radio.Group>{renderTransferMethodOptions()}</Radio.Group>
                </Form.Item>
                <Form.Item name='description' label='Nội dung chuyển khoản'>
                    <Input placeholder='Ví dụ: Tiền cà phê hôm trước' />
                </Form.Item>

                <Button type='primary' block onClick={onConfirmTransfer}>
                    Xác nhận
                </Button>
            </Form>
        </Container>
    );
};
