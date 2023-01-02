import React, { useState } from "react";
import { styled } from "@xstyled/styled-components";
import { Avatar, Button, Dropdown, Modal, Form, Input } from "antd";
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
  const [changePasswordForm] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <Form style={{width: "100%"}} form={changePasswordForm} layout="vertical">
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

            <Button type="primary" block style={{marginBottom:"20px"}}>
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
