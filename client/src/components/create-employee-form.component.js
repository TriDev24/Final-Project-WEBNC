import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Avatar, message } from 'antd';
import {
    LockOutlined,
    UserOutlined,
    ProfileOutlined,
    PhoneOutlined,
} from '@ant-design/icons';

export const CreateEmployeeForm = ({
    isVisible,
    onToggleVisibilityChange,
    getListEmployee
}) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    useEffect(() => {
        getListEmployee();
    }, []);

    const onFinish = async (values) => {
        setLoading(true);
        const {
            emailEmployee,
            passwordEmployee,
            phoneNumberEmployee,
            firstNameEmployee,
            lastNameEmployee,
            aliasNameEmployee,
            confirmEmployee,
        } = form.getFieldsValue();
        console.log(form.getFieldValue());
        if (confirmEmployee !== passwordEmployee) {
            messageApi.open({
                type: 'error',
                content: 'Nhập lại mật khẩu không trùng khớp với mật khẩu',
            });
            setLoading(false);
        } else {
            const data = JSON.stringify({
                emailEmployee,
                passwordEmployee,
                phoneNumberEmployee,
                firstNameEmployee,
                lastNameEmployee,
                aliasNameEmployee,
            });
            const result = await fetch(
                `${process.env.REACT_APP_IDENTITY_API_URL_PATH}/create-employee`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: localStorage.getItem('accessToken'),
                    },
                    body: data,
                }
            )
                .then((response) => response.json())
                .then((data) => data);

            if (!result.message) {
                messageApi.open({
                    type: 'success',
                    content: 'Tạo tài khoản thanh toán thành công!',
                });
                getListEmployee();
                form.resetFields();
                setLoading(false);
            } else {
                messageApi.open({
                    type: 'error',
                    content: result.message,
                });
                setLoading(false);
            }
        }
    };

    return (
        <>
            {contextHolder}
            <Modal
                centered
                title='Thêm nhân viên mới'
                okText='Xác nhận'
                cancelText='Huỷ'
                open={isVisible}
                onOk={onFinish}
                onCancel={onToggleVisibilityChange}>
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
                        onFinish={onFinish}
                        style={{ width: '100%' }}>
                        <Form.Item
                            name='emailEmployee'
                            rules={[
                                {
                                    required: true,
                                    message: 'Mời bạn nhập email!',
                                },
                                {
                                    type: 'email',
                                    message: 'Email không đúng định dạng!',
                                },
                            ]}>
                            <Input
                                prefix={
                                    <UserOutlined className='site-form-item-icon' />
                                }
                                placeholder='Email'
                            />
                        </Form.Item>
                        <Form.Item
                            name='passwordEmployee'
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
                            name='confirmEmployee'
                            rules={[
                                {
                                    required: true,
                                    message: 'Mời bạn xác nhận lại mật khẩu!',
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
                            name='firstNameEmployee'
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
                            name='lastNameEmployee'
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
                            name='phoneNumberEmployee'
                            rules={[
                                {
                                    required: true,
                                    message: 'Mời bạn nhập số điện thoại!',
                                },
                                {
                                    pattern: new RegExp(
                                        /(84|0[3|5|7|8|9])+([0-9]{8})\b/g
                                    ),
                                    message:
                                        'Số điện thoại không đúng định dạng',
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
                            name='aliasNameEmployee'
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
                    </Form>
                </div>
            </Modal>
        </>
    );
};
