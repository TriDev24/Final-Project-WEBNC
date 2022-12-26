import { styled } from '@xstyled/styled-components';
import {
    Button,
    Form,
    Input
} from 'antd';


const Container = styled.div`
    margin: 20px 10px;
`;


export const ChangePasswordForm = ({
    form,
    onConfirmTransfer,
}) => {


    return (
        <Container>
            <Form form={form} layout='vertical'>
                <Form.Item
                    name='oldPassword'
                    label='Mật khẩu cũ'
                    rules={[
                        {
                            required: true,
                            message: 'Nhập mật khẩu cũ',
                        },
                    ]}>
                    <Input placeholder='old password' />
                </Form.Item>
                <Form.Item
                    name='newPassword'
                    label='Mật khẩu mới'
                    rules={[
                        {
                            required: true,
                            message: 'Nhập mật khẩu mới',
                        },
                    ]}>
                    <Input placeholder='new password' />
                </Form.Item>

                <Button type='primary' block onClick={onConfirmTransfer}>
                    Xác nhận
                </Button>
            </Form>
        </Container>
    );
};
