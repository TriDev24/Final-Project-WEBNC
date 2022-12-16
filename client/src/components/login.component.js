import React, { useRef, useState } from "react";
import {useNavigate} from 'react-router-dom'
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Avatar, message } from "antd";
import ReCAPTCHA from "react-google-recaptcha";

const LoginForm = () => {
  const navigate = useNavigate();
  const captchaRef = useRef(null);

  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true)
    const url = "http://localhost:8080/api/identity/login";
    const email = values.email;
    const password = values.password;
    const g_token = captchaRef.current.getValue();
    if (!g_token) {
      messageApi.open({
        type: "error",
        content: "Captcha is not correct",
      });
      setLoading(false)
    } else {
      const data = JSON.stringify({ email, password, g_token });
      const result = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      })
        .then((response) => response.json())
        .then((data) => data);

      //Lấy profile bằng cách result.profile
      if (result.accessToken) {
        messageApi.open({
          type: "success",
          content: "Login successfully!",
        });
        localStorage.setItem('accessToken', result.accessToken);
        localStorage.setItem('refreshToken', result.refreshToken);
        setLoading(false)
        captchaRef.current.reset();
        setTimeout(()=>navigate("/dashboard"), 1000);
      } else {
        messageApi.open({
          type: "error",
          content: result.message,
        });
        setLoading(false)
      }
    }
    captchaRef.current.reset();
  };

  return (
    <>
      <div style={{ textAlign: "center", margin: "20px" }}>
        <Avatar size={200} src="/images/img_avatar.png"></Avatar>
      </div>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        style={{ width: "300px", margin: "20px" }}
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please input your Email!" },
            { type: "email", message: "Email invalidate" },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <ReCAPTCHA
          style={{ marginBottom: "20px" }}
          sitekey={process.env.REACT_APP_SITE_KEY}
          ref={captchaRef}
        />

        <Form.Item>
          {contextHolder}
          <Button
            style={{ width: "100%" }}
            type="primary"
            htmlType="submit"
            className="login-form-button"
            loading={loading}
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default LoginForm;
