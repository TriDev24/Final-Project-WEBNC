import React from 'react';
import LoginForm from '../components/login.component.js';

export const LoginPage = ({setAuth}) => {
    return (
        <div
            style={{
                width: '100vw',
                height: '100vh',
                backgroundImage: 'url(/images/background.jpg)',
                backgroundSize: "1500px 800px"
            }}>
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    border: '1px solid #e3f5ff',
                    borderRadius: '20px',
                    backgroundColor: 'white',
                }}>
                <LoginForm setAuth={setAuth}/>
            </div>
        </div>
    );
};
