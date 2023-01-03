import React, { useEffect, useState } from "react";
import { Typography, Table, Modal, Tooltip } from "antd";
import { Button, Space, message, Tag } from "antd";
import { PayCircleOutlined } from "@ant-design/icons";
import CreateDebitModal from "./create-debit.component.js";
import { styled } from "@xstyled/styled-components";
import OTPInput from "../common/otp-input/index.js";
import DeleteDebitModal from "./delete-debit.component.js";
import { useStore } from "../../store";

const { Title } = Typography;

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;


function DebitTable({ side }) {
  const [state, dispatch] = useStore()
  const {bankTypes, transferMethods, paymentAccountNumber} = state
  const [messageApi, contextHolder] = message.useMessage();
  const [otp, setOtp] = useState("");
  const [confirmOtpModalVisibility, setConfirmOtpModalVisibility] =
    useState(false);
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
          {record.transferDate === null
            ? "Không có"
            : new Date(parseInt(record.transferDate)).toLocaleString()}
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
            data={data}
            toggleConfirmOtpModalVisibility={toggleConfirmOtpModalVisibility}
            setLoading={setLoading}
          ></Action>
        ) : null;
      },
    },
  ];

  const fetchApi = async (side) => {
    const url = `${
      process.env.REACT_APP_DEBIT_URL_PATH
    }?accountNumber=${paymentAccountNumber}&side=${side}`;
  
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

  function Action({
    id,
    data,
    setData,
    toggleConfirmOtpModalVisibility,
    side,
    setLoading,
  }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [loadingPayment, setLoadingPayment] = useState(false);
  
    const payDebit = async () => {
      setLoadingPayment(true);
      const foundedDebit = data.find((d) => (d.id = id));
      console.log("foundedDebit", foundedDebit);
  
      const internalBankType = bankTypes.find((b) => b.name === "My Bank");

      const senderPayFeeMethod = transferMethods.find(
        (t) => t.name === "Sender Pay Transfer Fee"
      );
      const payload = {
        senderAccountNumber: paymentAccountNumber,
        receiverAccountNumber: foundedDebit.accountNumber,
        bankTypeId: internalBankType._id,
        deposit: foundedDebit.amountToPay,
        transferMethodId: senderPayFeeMethod._id,
        description: data.content,
        transferTime: Date.now(),
      };
      console.log(payload);
      const result = await fetch(process.env.REACT_APP_BILLING_API_URL_PATH, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("accessToken"),
        },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data._id) {
            toggleConfirmOtpModalVisibility();
            localStorage.setItem("billing-id", data._id);
            localStorage.setItem("paid-debit-id", id);
          } else {
            messageApi.open({
              type: "error",
              content: data,
            });
          }
          setLoadingPayment(false);
        });
    };
  
    return (
      <Space>
        {contextHolder}
        {side === "other" && (
          <Tooltip placement="top" title="Thanh toán">
            <Button
              loading={loadingPayment}
              icon={<PayCircleOutlined />}
              onClick={payDebit}
            ></Button>
          </Tooltip>
        )}
        <DeleteDebitModal
          id={id}
          setData={setData}
          side={side}
          setLoading={setLoading}
          fetchApi={fetchApi}
        ></DeleteDebitModal>
      </Space>
    );
  }

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
    setLoading,
  };

  const toggleConfirmOtpModalVisibility = () => {
    setConfirmOtpModalVisibility(!confirmOtpModalVisibility);
  };

  const handleConfirmOtp = () => {
    const url = `${
      process.env.REACT_APP_BILLING_API_URL_PATH
    }/${localStorage.getItem("billing-id")}/verify-otp`;
    const payload = {
      otp,
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("accessToken"),
      },
      body: JSON.stringify(payload),
    })
      .then(() => {
        toggleConfirmOtpModalVisibility();

        updateToPaidDebit();
      })
      .catch((error) => {
        message.error(error);
      });
  };

  const updateToPaidDebit = () => {
    setLoading(true);
    const id = localStorage.getItem("paid-debit-id");
    const url = `${process.env.REACT_APP_DEBIT_URL_PATH}/${id}`;
    const payload = {
      isPaid: true,
    };

    fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("accessToken"),
      },
      body: JSON.stringify(payload),
    })
      .then(async () => {
        messageApi.open({
          type: "success",
          content: "Thanh toán nhắc nợ thành công!",
        });
        await fetchApi(side).then((result) => setData(result));
        setLoading(false);
      })
      .catch((error) => {
        messageApi.open({
          type: "error",
          content: "Có lỗi xảy ra!",
        });
        setLoading(false);
      });
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Xác nhận giao dịch"
        centered
        okText="Xác nhận"
        cancelText="Huỷ"
        onOk={handleConfirmOtp}
        onCancel={toggleConfirmOtpModalVisibility}
        open={confirmOtpModalVisibility}
      >
        <div
          style={{
            textAlign: "center",
            border: "1px solid black",
            borderRadius: "10px",
            padding: "5px",
          }}
        >
          <OTPInput
            autoFocus
            length={4}
            onChangeOTP={(value) => {
              setOtp(value);
            }}
          />
        </div>
      </Modal>
      <ContentHeader>
        <Title level={2}>
          {side === "personal" ? "Nhắc nợ của tôi" : "Nhắc nợ của người khác"}
        </Title>
        {side === "personal" && <CreateDebitModal actions={actions} />}
      </ContentHeader>
      <Table loading={loadingState} columns={columns} dataSource={data} />
    </>
  );
}

export default DebitTable;
