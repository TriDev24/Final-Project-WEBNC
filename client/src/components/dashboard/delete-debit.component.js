import React, { useState } from "react";
import { Button, Modal, Form, Avatar, message, Tooltip, Input } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const { TextArea } = Input;

function DeleteDebitModal({ id, setData, side, setLoading, fetchApi }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoadingDelete(true);
    setLoading(true);

    const { content } = values;

    const data = JSON.stringify({
      content,
    });

    const url = `${process.env.REACT_APP_DEBIT_URL_PATH}/${id}/${side}`;

    const result = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("accessToken"),
      },
      body: data,
    })
      .then((response) => response.json())
      .then((data) => data);

    if (result.message) {
      message.error(result.message)
    } else {
      message.success("Đã hủy nhắc nợ thành công!")
    }
    await fetchApi(side).then((result) => setData(result));
    setLoading(false);
    setLoadingDelete(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = async () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Tooltip placement="top" title="Huỷ">
        <Button danger icon={<DeleteOutlined />} onClick={showModal}></Button>
      </Tooltip>
      <Modal
        footer={null}
        title="Hủy nhắc nợ"
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
            <Form.Item
              name="content"
              rules={[
                {
                  required: true,
                  message: "Mời bạn nhập nội dung hủy nhắc nợ!",
                },
              ]}
            >
              <TextArea rows={4} placeholder="Nội dung hủy nhắc nợ" />
            </Form.Item>

            <Form.Item>
              <Button
                style={{ width: "100%" }}
                type="primary"
                htmlType="submit"
                className="login-form-button"
                loading={loadingDelete}
              >
                Xác nhận
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
}

export default DeleteDebitModal;
