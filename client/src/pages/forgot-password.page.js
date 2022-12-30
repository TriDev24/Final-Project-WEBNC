import React, { useState } from 'react';
import ForgotPasswordForm from '../components/forgot-password.component.js';
import { Button, Result } from 'antd';

export const ForgotPasswordPage = () => {
    const [done, setDone] = useState(false);

    return (
        <>
            {!done ? (
                <div
                    style={{
                        width: '100vw',
                        height: '100vh',
                        backgroundImage: 'url(/images/background.jpg)',
                        backgroundSize: '1500px 800px',
                    }}>
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            border: '1px solid white',
                            borderRadius: '20px',
                            backgroundColor: 'white',
                        }}>
                        <ForgotPasswordForm setDone={setDone} />
                    </div>
                </div>
            ) : (
                <div
                    style={{
                        width: '100vw',
                        height: '100vh',
                        backgroundImage: 'url(/images/background.jpg)',
                        backgroundSize: '1500px 800px',
                    }}>
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            border: '1px solid white',
                            borderRadius: '20px',
                            backgroundColor: 'white',
                        }}>
                        <Result
                            status='success'
                            title='Đặt lại mật khẩu thành công!'
                            extra={[
                                <a href='/login'>
                                    <Button type='primary'>
                                        Quay về trang đăng nhập
                                    </Button>
                                </a>,
                            ]}
                        />
                    </div>
                </div>
            )}
        </>
    );
};
