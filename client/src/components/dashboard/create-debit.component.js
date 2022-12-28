import React, { useState } from "react";
import { Button, Modal, Form, Input, Avatar, message } from "antd";
import { MoneyCollectOutlined, BankOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const CreateDebitModal = ({ actions, debtAccount }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    let debtAccountNumber;
    if (debtAccount) {
      debtAccountNumber = debtAccount;
    } else debtAccountNumber = values.debtAccountNumber;
    const { amountToPay, content } = values;

    const accountNumber = localStorage.getItem("payment-account-number");
    const data = JSON.stringify({
      accountNumber,
      debtAccountNumber,
      amountToPay,
      content,
    });

    const result = await fetch(process.env.REACT_APP_DEBIT_URL_PATH, {
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

    form.resetFields();
    setLoading(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = async () => {
    setIsModalOpen(false);
    if(!debtAccount){
      actions.setLoading(true);
      await actions
        .fetchApi("personal")
        .then((result) => actions.setData(result));
      actions.setLoading(false);
    }
  };
  return (
    <>
      <Button
        type="primary"
        onClick={showModal}
        style={{ marginBottom: "5px" }}
      >
        Tạo nhắc nợ
      </Button>
      <Modal
        footer={null}
        title="Tạo nhắc nợ"
        open={isModalOpen}
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
            <Avatar size={200} src="/images/debt.png"></Avatar>
          </div>
          <Form
            form={form}
            name="normal_login"
            className="login-form"
            onFinish={onFinish}
            style={{ width: "100%" }}
          >
            {!debtAccount && (
              <Form.Item
                name="debtAccountNumber"
                rules={[
                  {
                    required: true,
                    message: "Mời bạn nhập số tài khoản người cần nhắc nợ!",
                  },
                ]}
              >
                <Input
                  prefix={<BankOutlined className="site-form-item-icon" />}
                  placeholder="Số tài khoản nợ"
                />
              </Form.Item>
            )}

            <Form.Item
              name="amountToPay"
              rules={[
                {
                  required: true,
                  message: "Mời bạn nhập số tiền phải trả!",
                },
              ]}
            >
              <Input
                prefix={
                  <MoneyCollectOutlined className="site-form-item-icon" />
                }
                placeholder="Số tiền phải trả"
              />
            </Form.Item>

            <Form.Item
              name="content"
              rules={[
                {
                  required: true,
                  message: "Mời bạn nhập nội dung nhắc nợ!",
                },
              ]}
            >
              <TextArea rows={4} placeholder="Nội dung nhắc nợ" />
            </Form.Item>

            <Form.Item>
              {contextHolder}
              <Button
                style={{ width: "100%" }}
                type="primary"
                htmlType="submit"
                className="login-form-button"
                loading={loading}
              >
                Tạo nhắc nợ
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};
export default CreateDebitModal;
