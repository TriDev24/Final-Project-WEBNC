import React, { useState } from 'react';
import { Button, Modal, Form, Input, Avatar, message } from 'antd';
import {
    LockOutlined,
    UserOutlined,
    ProfileOutlined,
    PhoneOutlined,
} from '@ant-design/icons';

const CreateIdentityModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        setLoading(true);
        const {
            email,
            password,
            phoneNumber,
            firstName,
            lastName,
            aliasName,
            confirm,
        } = values;
        if (confirm !== password) {
            messageApi.open({
                type: 'error',
                content: 'Nhập lại mật khẩu không trùng khớp với mật khẩu',
            });
            setLoading(false);
        } else {
            const data = JSON.stringify({
                email,
                password,
                phoneNumber,
                firstName,
                lastName,
                aliasName,
            });
            const result = await fetch(
                process.env.REACT_APP_IDENTITY_API_URL_PATH,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: data,
                }
            )
                .then((response) => response.json())
                .then((data) => data);

            if (!result.message) {
                messageApi.open({
                    type: 'success',
                    content: 'Tạo tài khoản thanh toán!',
                });
                form.resetFields();
                setLoading(false);
                setIsModalOpen(false);
            } else {
                messageApi.open({
                    type: 'error',
                    content: result.message,
                });
                setLoading(false);
            }
        }
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <>
            <Button type='primary' onClick={showModal}>
                Create Identity
            </Button>
            <Modal
                footer={null}
                title='Tạo tài khoản khách hàng'
                open={isModalOpen}
                onCancel={handleCancel}>
                <div
                    style={{
                        border: '1px solid #1677ff',
                        borderRadius: '20px',
                        paddingLeft: '20px',
                        paddingRight: '20px',
                    }}>
                    <div style={{ textAlign: 'center', margin: '20px' }}>
                        <Avatar
                            size={200}
                            src='/images/img_avatar.png'></Avatar>
                    </div>
                    <Form
                        form={form}
                        name='normal_login'
                        className='login-form'
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        style={{ width: '100%' }}>
                        <Form.Item
                            name='email'
                            rules={[
                                {
                                    required: true,
                                    message: 'Mời bạn nhập email!',
                                },
                                { type: 'email', message: 'Email không đúng định dạng!' },
                            ]}>
                            <Input
                                prefix={
                                    <UserOutlined className='site-form-item-icon' />
                                }
                                placeholder='Email'
                            />
                        </Form.Item>
                        <Form.Item
                            name='password'
                            rules={[
                                {
                                    required: true,
                                    message: 'Mời bạn nhập mật khẩu!',
                                },
                                {
                                    min: 8,
                                    message: 'Mật khẩu phải ít nhất 8 ký tự!',
                                },
                            ]}>
                            <Input
                                prefix={
                                    <LockOutlined className='site-form-item-icon' />
                                }
                                type='password'
                                placeholder='Mật khẩu'
                            />
                        </Form.Item>

                        <Form.Item
                            name='confirm'
                            rules={[
                                {
                                    required: true,
                                    message:
                                        'Mời bạn xác nhận lại mật khẩu!',
                                },
                                {
                                    min: 8,
                                    message:
                                        'Mật khẩu xác nhận phải ít nhất 8 ký tự',
                                },
                            ]}>
                            <Input
                                prefix={
                                    <LockOutlined className='site-form-item-icon' />
                                }
                                type='password'
                                placeholder='Xác nhận mật khẩu'
                            />
                        </Form.Item>

                        <Form.Item
                            name='firstName'
                            rules={[
                                {
                                    required: true,
                                    message: 'Mời bạn nhập tên!',
                                },
                            ]}>
                            <Input
                                prefix={
                                    <ProfileOutlined className='site-form-item-icon' />
                                }
                                placeholder='Tên'
                            />
                        </Form.Item>

                        <Form.Item
                            name='lastName'
                            rules={[
                                {
                                    required: true,
                                    message: 'Mời bạn nhập họ!',
                                },
                            ]}>
                            <Input
                                prefix={
                                    <ProfileOutlined className='site-form-item-icon' />
                                }
                                placeholder='Họ'
                            />
                        </Form.Item>

                        <Form.Item
                            name='phoneNumber'
                            rules={[
                                {
                                    required: true,
                                    message: 'Mời bạn nhập số điện thoại!',
                                },
                                {
                                    pattern: new RegExp(
                                        /(84|0[3|5|7|8|9])+([0-9]{8})\b/g
                                    ),
                                    message: 'Số điện thoại không đúng định dạng',
                                },
                            ]}>
                            <Input
                                prefix={
                                    <PhoneOutlined className='site-form-item-icon' />
                                }
                                placeholder='Số điện thoại'
                            />
                        </Form.Item>

                        <Form.Item
                            name='aliasName'
                            rules={[
                                {
                                    required: true,
                                    message: 'Mời bạn nhập tên gợi nhớ!',
                                },
                            ]}>
                            <Input
                                prefix={
                                    <ProfileOutlined className='site-form-item-icon' />
                                }
                                placeholder='Tên gợi nhớ'
                            />
                        </Form.Item>

                        <Form.Item>
                            {contextHolder}
                            <Button
                                style={{ width: '100%' }}
                                type='primary'
                                htmlType='submit'
                                className='login-form-button'
                                loading={loading}>
                                Tạo tài khoản
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </>
    );
};
export default CreateIdentityModal;
