import React, { useState, useRef } from "react";
import { Button, message, Steps, Input, Space, Typography } from "antd";
import { LockOutlined, UserOutlined, KeyOutlined } from "@ant-design/icons";

const ForgotPasswordForm = ({ setDone }) => {
  const [current, setCurrent] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();
  const passwordInput = useRef();

  const EmailForm = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");

    const handleChange = (e) => {
      setEmail(e.target.value);
    };

    const handleClick = async () => {
      setLoading(true);
      const url = `${process.env.REACT_APP_FORGOT_API_URL_PATH}/${email}`;
      const result = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => data);
      messageApi.open({
        type: result.status,
        content: result.message,
      });
      if (result.status === "success") {
        next();
      }
      setLoading(false);
    };

    return (
      <Space
        style={{ width: "100%", textAlign: "center" }}
        direction="vertical"
      >
        <Input
          value={email}
          placeholder="Email"
          style={{ width: "300px" }}
          prefix={<UserOutlined />}
          onChange={handleChange}
        />
        <Button
          type="primary"
          loading={loading}
          style={{ marginBottom: "10px" }}
          onClick={handleClick}
        >
          Tìm kiếm
        </Button>
      </Space>
    );
  };

  const PasswordForm = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleChangePassword = (e) => {
      setPassword(e.target.value);
    };

    const handleChangeConfirm = (e) => {
      setConfirmPassword(e.target.value);
    };

    const handleClick = () => {
      if (password === confirmPassword) {
        passwordInput.current = password;
        next();
      } else {
        messageApi.open({
          type: "error",
          content: "Xác nhận mật khẩu không trùng khớp!",
        });
      }
    };

    return (
      <Space
        direction="vertical"
        style={{ width: "100%", textAlign: "center" }}
      >
        <Input
          value={password}
          placeholder="Mật khẩu"
          style={{ width: "300px" }}
          prefix={<LockOutlined />}
          onChange={handleChangePassword}
          type="password"
        />
        <Input
          value={confirmPassword}
          placeholder="Nhập lại mật khẩu"
          style={{ width: "300px" }}
          prefix={<LockOutlined />}
          onChange={handleChangeConfirm}
          type="password"
        />
        <Space style={{ marginBottom: "10px" }}>
          <Button onClick={() => prev()}>Trở về trước</Button>
          <Button type="primary" onClick={handleClick}>
            Tiếp tục
          </Button>
        </Space>
      </Space>
    );
  };

  const OTPForm = () => {
    const [otp, setOTP] = useState("");
    const [loading, setLoading] = useState(false);
    const handleChane = (e) => {
      setOTP(e.target.value);
    };

    const handleClick = async () => {
      setLoading(true);
      const data = JSON.stringify({ otp, password: passwordInput.current });
      const url = `${process.env.REACT_APP_VERIFY_API_URL_PATH}`;
      const result = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      })
        .then((response) => response.json())
        .then((data) => data);
      messageApi.open({
        type: result.status,
        content: result.message,
      });
      if (result.status === "success") {
        setDone(true);
      }
      setLoading(false);
    };

    return (
      <Space
        direction="vertical"
        style={{ width: "100%", textAlign: "center" }}
      >
        <Input
          value={otp}
          placeholder="OTP"
          style={{ width: "300px" }}
          prefix={<KeyOutlined />}
          onChange={handleChane}
        />
        <Space style={{ marginBottom: "10px" }}>
          <Button onClick={() => prev()}>Trở về trước</Button>
          <Button type="primary" loading={loading} onClick={handleClick}>
            Xác thực
          </Button>
        </Space>
      </Space>
    );
  };

  const steps = [
    {
      title: "Nhập email",
      content: <EmailForm></EmailForm>,
    },
    {
      title: "Đặt lại mật khẩu",
      content: <PasswordForm />,
    },
    {
      title: "Xác thực OTP",
      content: <OTPForm />,
    },
  ];

  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  return (
    <Space direction="vertical" style={{ textAlign: "center" }}>
      {contextHolder}
      <Steps
        current={current}
        items={items}
        style={{ width: "800px", padding: "10px" }}
      />
      <div className="steps-content">{steps[current].content}</div>
    </Space>
  );
};
export default ForgotPasswordForm;
