import React, { useEffect, useState } from "react";
import { Typography, Table, Space, Tooltip, message,Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import CreateDebitModal from "./create-debit.component.js";
import { useStore } from "../../store";

const { Title } = Typography;

function DebtorTable() {
  const [state, dispatch] = useStore()
  const {paymentAccountNumber} = state
  const [data, setData] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [loadingState, setLoading] = useState(true);

  const fetchApi = async () => {
    const url = `${
      process.env.REACT_APP_DEBTOR_URL_PATH
    }?accountNumber=${paymentAccountNumber}`;

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
          accountNumber: value.debtAccountId.accountNumber,
          aliasName: value.debtAccountId.identityId.aliasName,
          createdAt: new Date(parseInt(value.createdAt)).toLocaleDateString(),
        }));
      });

    return result;
  };

  const handleClick = async (id) => {
    setLoading(true);

    const url = `${process.env.REACT_APP_DEBTOR_URL_PATH}/${id}`;

    const result = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("accessToken"),
      },
    })
      .then((response) => response.json())
      .then((data) => data);

    if (result.message) {
      messageApi.open({
        type: "error",
        content: result.message,
      });
    } else {
      messageApi.open({
        type: "success",
        content: "Đã xóa người nợ thành công!",
      });
    }
    await fetchApi().then((result) => setData(result));
    setLoading(false);
  };

  const actions = {
    setData,
    fetchApi,
    setLoading,
  };
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
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Hành động",
      dataIndex: "Actions",
      render: (text, record) => (
        <Space>
          <CreateDebitModal
            actions={actions}
            debtAccount={record.accountNumber}
          ></CreateDebitModal>
          <Tooltip placement="top" title="Xóa người nợ">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleClick(record.id)}
            ></Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      await fetchApi().then((result) => setData(result));

      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <>
      {contextHolder}
      <Title level={2}>Danh sách người nợ</Title>
      <Table loading={loadingState} columns={columns} dataSource={data} />
    </>
  );
}

export default DebtorTable;
