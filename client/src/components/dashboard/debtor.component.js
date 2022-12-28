import React, { useEffect, useState } from "react";
import { Typography, Table } from "antd";
import CreateDebitModal from "./create-debit.component.js";

const { Title } = Typography;

function DebtorTable() {
  const [data, setData] = useState([]);
  const [loadingState, setLoading] = useState(true);

  const fetchApi = async () => {
    const url = `${
      process.env.REACT_APP_DEBTOR_URL_PATH
    }?accountNumber=${localStorage.getItem("payment-account-number")}`;

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
        <CreateDebitModal
          actions={actions}
          debtAccount={record.accountNumber}
        ></CreateDebitModal>
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
      <Title level={2}>Danh sách người nợ</Title>
      <Table loading={loadingState} columns={columns} dataSource={data} />
    </>
  );
}

export default DebtorTable;
