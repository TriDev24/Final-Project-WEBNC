import React, { useEffect, useState } from "react";
import { Typography, Table } from "antd";
import { Button, Space, message, Tag } from "antd";
import { PayCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import CreateDebitModal from "./create-debit.component.js";

const { Title } = Typography;

const fetchApi = async (side) => {
  const url = `${
    process.env.REACT_APP_DEBIT_URL_PATH
  }?accountNumber=${localStorage.getItem(
    "payment-account-number"
  )}&side=${side}`;

  const result = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: localStorage.getItem("accessToken"),
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data.map((value, index) => ({
        key: index,
        id: value._id,
        accountNumber:
          side === "personal"
            ? value.debtAccountId.accountNumber
            : value.accountId.accountNumber,
        aliasName:
          side === "personal"
            ? value.debtAccountId.identityId.aliasName
            : value.accountId.identityId.aliasName,
        amountToPay: value.amountToPay,
        content: value.content,
        status: value.statusId.name,
        transferDate: value.transferDate,
        createdAt: new Date(parseInt(value.createdAt)).toLocaleString(),
      }));
    });

  return result;
};

function Action({ id, setData, side, setLoading }) {
  const [messageApi, contextHolder] = message.useMessage();
  const deleteDebit = async () => {
    setLoading(true);

    const url = `${process.env.REACT_APP_DEBIT_URL_PATH}/${id}/${side}`;

    const result = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("accessToken"),
      },
    })
      .then((response) => response.json())
      .then((data) => data);

    await fetchApi(side).then((result) => setData(result));

    setLoading(false);

    if (result.message) {
      messageApi.open({
        type: "error",
        content: result.message,
      });
    } else {
      messageApi.open({
        type: "success",
        content: "Đã hủy nhắc nợ thành công!",
      });
    }
  };
  return (
    <Space>
      {contextHolder}
      <Button icon={<PayCircleOutlined />}></Button>
      <Button danger icon={<DeleteOutlined />} onClick={deleteDebit}></Button>
    </Space>
  );
}

function DebitTable({ side }) {
  const [data, setData] = useState([]);
  const [loadingState, setLoading] = useState(true);
  const columns = [
    {
      title: "Số tài khoản",
      dataIndex: "accountNumber",
      key: "accountNumber",
    },
    {
      title: "Tên tài khoản",
      dataIndex: "aliasName",
      key: "aliasName",
    },
    {
      title: "Số tiền phải trả",
      dataIndex: "amountToPay",
      key: "amountToPay",
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text, record) => {
        if (record.status === "unpaid")
          return <Tag color="red">Chưa thanh toán</Tag>;
        else if (record.status === "paid")
          return <Tag color="green">Đã thanh toán</Tag>;
        else return <Tag type="default">Đã hủy</Tag>;
      },
    },
    {
      title: "Ngày trả",
      dataIndex: "transferDate",
      key: "transferDate",
      render: (text, record) => (
        <span>
          {record.transferDate === null ? "Không có" : record.transferDate}
        </span>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Hành động",
      dataIndex: "Actions",
      render: (text, record) => {
        return record.status !== "cancelled" && record.status !== "paid" ? (
          <Action
            setData={setData}
            id={record.id}
            side={side}
            setLoading={setLoading}
          ></Action>
        ) : null;
      },
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      await fetchApi(side).then((result) => setData(result));

      setLoading(false);
    };
    fetchData();
  }, [side]);

  const actions = {
    setData,
    fetchApi,
    setLoading
  }

  return (
    <>
      <Space size={750}>
        <Title level={2}>
          {side === "personal"
            ? "Nhắc nợ của cá nhân"
            : "Nhắc nợ của người khác"}
        </Title>
        {side === "personal" && <CreateDebitModal actions={actions}/>}
      </Space>
      <Table loading={loadingState} columns={columns} dataSource={data} />
    </>
  );
}

export default DebitTable;
