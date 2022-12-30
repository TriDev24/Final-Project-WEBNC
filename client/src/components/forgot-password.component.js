import React, { useState, useRef } from "react";
import { Button, message, Steps, Input, Space, Typography, Avatar } from "antd";
import { LockOutlined, UserOutlined, KeyOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

const ForgotPasswordForm = ({ setDone }) => {
  const [current, setCurrent] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();
  const passwordInput = useRef();

  const EmailForm = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("");
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
      setStatus("");
      setEmail(e.target.value);
    };

    const handleClick = async () => {
      let pattern =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const result = pattern.test(email);
      if (email.length === 0) {
        setStatus("error");
        setMessage("Mời bạn nhập email!");
      } else if (!result) {
        setStatus("error");
        setMessage("Email không đúng định dạng!");
      } else {
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
      }
    };

    return (
      <Space
        style={{ width: "100%", textAlign: "center" }}
        direction="vertical"
      >
        <Space direction="vertical" align="start">
          <Input
            value={email}
            placeholder="Email"
            style={{ width: "300px" }}
            prefix={<UserOutlined />}
            onChange={handleChange}
            status={status}
          />
          {status === "error" && <Text type="danger">{message}</Text>}
          <Button
            type="primary"
            loading={loading}
            style={{ marginBottom: "20px" }}
            onClick={handleClick}
          >
            Tìm kiếm
          </Button>
        </Space>
      </Space>
    );
  };

  const PasswordForm = () => {
    const message = "Mật khẩu phải ít nhất 8 ký tự";
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordStatus, setPasswordStatus] = useState("");
    const [confirmStatus, setConfirmStatus] = useState("");

    const handleChangePassword = (e) => {
      setPasswordStatus("");
      setPassword(e.target.value);
    };

    const handleChangeConfirm = (e) => {
      setConfirmStatus("");
      setConfirmPassword(e.target.value);
    };

    const handleClick = () => {
      if (password.length < 8) {
        setPasswordStatus("error");
      } else if (confirmPassword.length < 8) {
        setConfirmStatus("error");
      } else if (password === confirmPassword) {
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
        <Space direction="vertical" align="start">
          <Input
            value={password}
            placeholder="Mật khẩu"
            style={{ width: "300px" }}
            prefix={<LockOutlined />}
            onChange={handleChangePassword}
            type="password"
            status={passwordStatus}
          />
          {passwordStatus === "error" && <Text type="danger">{message}</Text>}
          <Input
            value={confirmPassword}
            placeholder="Nhập lại mật khẩu"
            style={{ width: "300px" }}
            prefix={<LockOutlined />}
            onChange={handleChangeConfirm}
            type="password"
            status={confirmStatus}
          />
          {confirmStatus === "error" && <Text type="danger">{message}</Text>}
          <Space style={{ marginBottom: "20px" }}>
            <Button onClick={() => prev()}>Trở về trước</Button>
            <Button type="primary" onClick={handleClick}>
              Tiếp tục
            </Button>
          </Space>
        </Space>
      </Space>
    );
  };

  const OTPForm = () => {
    const [otp, setOTP] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");

    const handleChane = (e) => {
      setStatus("");
      setOTP(e.target.value);
    };

    const handleClick = async () => {
      if (otp.length === 0) {
        setStatus("error");
      } else {
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
      }
    };

    return (
      <Space
        direction="vertical"
        style={{ width: "100%", textAlign: "center" }}
      >
        <Space direction="vertical" align="start">
          <Input
            value={otp}
            placeholder="OTP"
            style={{ width: "300px" }}
            prefix={<KeyOutlined />}
            onChange={handleChane}
            status={status}
          />
          {status === "error" && <Text type="danger">Mời bạn nhập mã OTP</Text>}
          <Space style={{ marginBottom: "20px" }}>
            <Button onClick={() => prev()}>Trở về trước</Button>
            <Button type="primary" loading={loading} onClick={handleClick}>
              Xác thực
            </Button>
          </Space>
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
    <Space direction="vertical" align="center">
      <Avatar
        size={100}
        style={{ marginTop: "10px" }}
        shape="square"
        src="/images/forgot.png"
      ></Avatar>
      <Title level={2}>Lấy lại mật khẩu</Title>
      {contextHolder}
      <Steps size="small"
        current={current}
        items={items}
        style={{ width: "550px", padding: "0px 20px", marginBottom: "10px" }}
      />
      <div className="steps-content">{steps[current].content}</div>
    </Space>
  );
};
export default ForgotPasswordForm;
