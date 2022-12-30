import React, { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Avatar, message } from "antd";
import ReCAPTCHA from "react-google-recaptcha";

const LoginForm = () => {
  const navigate = useNavigate();
  const captchaRef = useRef(null);

  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);

    const email = values.email;
    const password = values.password;
    const g_token = captchaRef.current.getValue();
    if (!g_token) {
      messageApi.open({
        type: "error",
        content: "Captcha không chính xác!",
      });
      setLoading(false);
    } else {
      const data = JSON.stringify({ email, password, g_token });
      const result = await fetch(process.env.REACT_APP_LOGIN_API_URL_PATH, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      })
        .then((response) => response.json())
        .then((data) => data);

      if (result.accessToken) {
        messageApi
          .open({
            type: "success",
            content: "Đăng nhập thành công!",
            duration: 1,
          })
          .then(() => {
            localStorage.setItem("accessToken", result.accessToken);
            localStorage.setItem("refreshToken", result.refreshToken);
            localStorage.setItem("profile", JSON.stringify(result.profile));

            setLoading(false);
            captchaRef.current.reset();

            const { role } = result.profile;
            switch (role) {
              case "admin": {
                navigate("/admin/dashboard");
                return;
              }
              case "employee": {
                navigate("/employee/dashboard");
                return;
              }
              default: {
                navigate("/dashboard");
                return;
              }
            }
          });
      } else {
        messageApi.open({
          type: "error",
          content: result.message,
        });
        setLoading(false);
      }
    }
    captchaRef.current.reset();
  };

  return (
    <>
      <div style={{ textAlign: "center", margin: "20px" }}>
        <Avatar size={200} src="/images/avatar.png"></Avatar>
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
            { required: true, message: "Mời bạn nhập email!" },
            {
              type: "email",
              message: "Email không đúng định dạng",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Mời bạn nhập mật khẩu!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Mật khẩu"
          />
        </Form.Item>
        <ReCAPTCHA
          style={{ marginBottom: "20px" }}
          sitekey={process.env.REACT_APP_SITE_KEY}
          ref={captchaRef}
        />

        <Form.Item>
          <Link to="/forgot-password">Forgot password</Link>
          {contextHolder}
          <Button
            style={{ width: "100%" }}
            type="primary"
            htmlType="submit"
            className="login-form-button"
            loading={loading}
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default LoginForm;
