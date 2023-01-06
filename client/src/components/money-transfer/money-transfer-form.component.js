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
    message,
    Typography,
} from 'antd';
import { useState } from 'react';
import { ReceiverItem } from './receiver-item.component.js';

const { Panel } = Collapse;

const { Option } = Select;

const { Text } = Typography;

const Container = styled.div`
    margin: 20px 10px;
`;

const StyledDepositInput = styled(InputNumber)`
    width: 100%;
`;

const FloatRight = styled.div`
    float: right;
`;

const CenterText = styled.div`
    text-align: center;
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
    const [isValid, setIsValid] = useState(null);
    const [isLoadingCheckReceiver, setLoadingCheckReceiverStatus] =
        useState(false);
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

    const handleCheckReceiverExist = () => {
        setLoadingCheckReceiverStatus(true);

        const { receiverAccountNumber, bankTypeId } = form.getFieldsValue();
        console.log('form.getFieldsValue()', form.getFieldsValue());
        const url = `${process.env.REACT_APP_BANK_ACCOUNT_API_URL_PATH}/by-account-number-and-bank-type?accountNumber=${receiverAccountNumber}&bankTypeId=${bankTypeId}`;

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('accessToken'),
            },
        })
            .then((response) => response.json())
            .then((value) => {
                setLoadingCheckReceiverStatus(false);

                if (value.message) {
                    setIsValid(false);
                    message.error(value.message);
                    return;
                }

                setIsValid(true);
                Modal.success({
                    title: 'Tài khoản hợp lệ',
                    content: (
                        <>
                            <p>
                                <strong>Số tài khoản: </strong>{' '}
                                {value.accountNumber}
                            </p>
                            <p>
                                <strong>Tên thường gọi: </strong>
                                {value.user.fullname}
                            </p>
                            <p>
                                <strong>Email: </strong>
                                {value.user.email}
                            </p>
                            <p>
                                <strong>Số điện thoại: </strong>
                                {value.user.phone}
                            </p>
                        </>
                    ),
                });
            });
    };

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
            <Form form={form} layout='vertical'>
                <CenterText>
                    {isValid && isValid === true ? (
                        <Text type='success'>Tài khoản hợp lệ</Text>
                    ) : (
                        <Text type='danger'>Tài khoản chưa được xác minh</Text>
                    )}
                </CenterText>

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
                    <FloatRight>
                        <Button
                            type='default'
                            onClick={handleCheckReceiverExist}
                            loading={isLoadingCheckReceiver}>
                            Kiểm tra người nhận
                        </Button>
                    </FloatRight>
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
