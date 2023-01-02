import React, { useState } from "react";
import { styled } from "@xstyled/styled-components";
import { Avatar, Button, Dropdown, Modal, Form, Input, message } from "antd";
import { useNavigate, Link } from 'react-router-dom';
import { SecurityScanOutlined } from "@ant-design/icons";

const Container = styled.div`
  margin: 20px 10px;
`;

const getItem = (label, key, icon, children) => {
  return {
    key,
    icon,
    children,
    label,
  };
};

const items = [getItem(<ChangePasswordModal></ChangePasswordModal>, "1")];

function ChangePasswordModal() {
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [changePasswordForm] = Form.useForm();

  

  const onFinish = async (values) => {
    console.log(222222444)
    setLoading(true);
    // let debtAccountNumber;
    // if (debtAccount) {
    //   debtAccountNumber = debtAccount;
    // } else debtAccountNumber = values.debtAccountNumber;
    // const { amountToPay, content } = values;

    // const accountNumber = localStorage.getItem("payment-account-number");
    const data = JSON.stringify({
      "lhtinh": "test"
    });
    console.log(process.env.REACT_APP_DEBIT_URL_PATH);

    const result = await fetch(process.env.REACT_APP_CHANGE_PASSWORD_PATH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("accessToken"),
      },
      body: data,
    })
      .then((response) => response.json())
      .then((data) => data);

    messageApi.open({
      type: result.status,
      content: result.message,
    });

    changePasswordForm.resetFields();
    setLoading(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button icon={<SecurityScanOutlined />} onClick={showModal}>
        Đổi mật khẩu
      </Button>
      <Modal
        footer={null}
        title="Thay đổi mật khẩu"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div
          style={{
            border: "1px solid #1677ff",
            borderRadius: "20px",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          <div style={{ textAlign: "center", margin: "20px" }}>
            <Avatar size={200} shape="square" src="/images/reset-password.png"></Avatar>
          </div>
          <Form style={{width: "100%"}} name="normal_login"
            className="login-form" form={changePasswordForm} onFinish={onFinish} layout="vertical">
            <Form.Item
              name="oldPassword"
              label="Mật khẩu cũ"
              rules={[
                {
                  required: true,
                  message: "Nhập mật khẩu cũ",
                },
              ]}
            >
              <Input placeholder="Mật khẩu cũ" />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label="Mật khẩu mới"
              rules={[
                {
                  required: true,
                  message: "Nhập mật khẩu mới",
                },
              ]}
            >
              <Input placeholder="Mật khẩu mới" />
            </Form.Item>
            <Button type="primary" block style={{marginBottom:"20px"}} htmlType="submit" className="login-form-button" loading={loading} >
              Xác nhận
            </Button>
          </Form>
        </div>
      </Modal>
    </>
  );
}

export const ChangePassword = () => {
  return (
    <Container>
      <Dropdown
        menu={{
          items,
        }}
        placement="bottomLeft"
        arrow={{
          pointAtCenter: true,
        }}
        trigger={["click"]}
      >
        <Button
          type="ghost"
          shape="circle"
          icon={
            <Avatar
              style={{ marginBottom: "5px" }}
              src="/images/avatar.png"
            ></Avatar>
          }
        ></Button>
      </Dropdown>
    </Container>
  );
};
export default ChangePasswordModal;