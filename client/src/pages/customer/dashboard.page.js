import Title from "antd/es/typography/Title.js";
import { CustomerLayout } from "../../components/common/customer-layout.component.js";
import styled from "@xstyled/styled-components";
import { Button, Checkbox, message, Modal, Skeleton, Table } from "antd";
import { ServiceList } from "../../components/dashboard/service-list.component.js";
import { SwapOutlined } from "@ant-design/icons";
import { useEffect, useState, useCallback } from "react";
import { BankAccountList } from "../../components/dashboard/bank-account-list.component.js";
import { MoneyTransferForm } from "../../components/money-transfer/money-transfer-form.component.js";
import { Form } from "antd";
import OTPInput from "../../components/common/otp-input/index.js";
import { useStore, actions } from "../../store";

const GeneralInformationSection = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ServiceSection = styled.div`
  margin: 30px 0px;
`;

const HistorySection = styled.div``;

export const CustomerDashBoardPage = () => {
  const [state, dispatch] = useStore();
  const { profile, paymentAccountNumber, bankTypes, transferMethods } = state;
  const [receivers, setReceivers] = useState(null);
  const [moneyTransferForm] = Form.useForm();
  const [paymentAccountInfo, setPaymentAccount] = useState(null);
  const [bankAccounts, setBankAccountList] = useState([]);
  const [changeAccountModalVisibility, setChangeAccountModalVisibility] =
    useState(false);
  const [confirmOtpModalVisibility, setConfirmOtpModalVisibility] =
    useState(false);
  const [moneyTransferModalVisibility, setMoneyTransferModalVisibility] =
    useState(false);
  const [otp, setOtp] = useState("");

  const toggleConfirmOtpModalVisibility = () => {
    setConfirmOtpModalVisibility(!confirmOtpModalVisibility);
  };

  const getPaymentBankAccount = useCallback(() => {
    const apiUrl = `${process.env.REACT_APP_BANK_ACCOUNT_API_URL_PATH}?isPayment=true`;

    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("accessToken"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPaymentAccount(data[0]);
        localStorage.setItem("payment-account-number", data[0].accountNumber)
        dispatch(actions.setPaymentAccountNumber(localStorage.getItem("payment-account-number")));
      });
  }, []);

  const getReceivers = useCallback(() => {
    const url = `${
      process.env.REACT_APP_RECEIVER_API_URL_PATH
    }?accountNumber=${paymentAccountNumber}`;

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("accessToken"),
      },
    })
      .then((response) => response.json())
      .then((data) => setReceivers(data));
  }, []);

  useEffect(() => {
    getPaymentBankAccount();
  }, [bankAccounts]);

  useEffect(() => {
    getReceivers();
  }, [paymentAccountInfo]);

  useEffect(() => {
    const getBankTypes = async () => {
      fetch(process.env.REACT_APP_BANK_TYPE_API_URL_PATH, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("accessToken"),
        },
      })
        .then((response) => response.json())
        .then((data) => {
          dispatch(actions.setBankTypes(data));
        });
    };

    const getTransferMethods = async () => {
      fetch(process.env.REACT_APP_TRANSFER_METHOD_API_URL_PATH, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("accessToken"),
        },
      })
        .then((response) => response.json())
        .then((data) => {
          dispatch(actions.setTransferMethods(data));
        });
    };

    getBankTypes();
    getTransferMethods();
  }, []);

  const handleSelectPaymentAccountClick = (bankAccount) => {
    const url = `${process.env.REACT_APP_BANK_ACCOUNT_API_URL_PATH}/${bankAccount._id}`;
    const data = {
      isPayment: true,
    };

    fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("accessToken"),
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        localStorage.setItem("payment-account-number", bankAccount.accountNumber)
        dispatch(actions.setPaymentAccountNumber(localStorage.getItem("payment-account-number")));
        message.success("Change Account Success");
        setPaymentAccount(bankAccount);
        getReceivers();
      })
      .catch((error) => message.error(error));
  };

  const toggleChangeAccountModalVisible = () =>
    setChangeAccountModalVisibility(!changeAccountModalVisibility);

  const toggleMoneyTransferModalVisible = () =>
    setMoneyTransferModalVisibility(!moneyTransferModalVisibility);

  const services = [
    {
      icon: <SwapOutlined />,
      name: "Chuyển tiền",
      onClick: toggleMoneyTransferModalVisible,
    },
  ];

  const dataSource = [];

  const columns = [
    {
      title: "Số tài khoản",
      dataIndex: "receiverId",
      key: "receiverId",
    },
    {
      title: "Số tiền",
      dataIndex: "money",
      key: "money",
    },
    {
      title: "Hình thức thanh toán",
      dataIndex: "method",
      key: "method",
    },
    {
      title: "Nội dung",
      dataIndex: "description",
      key: "description",
    },
  ];

  const getBankAccounts = useCallback(() => {
    fetch(process.env.REACT_APP_BANK_ACCOUNT_API_URL_PATH, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("accessToken"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setBankAccountList(data);
      });
  }, []);

  const handleChangeAccountClick = () => {
    getBankAccounts();
    toggleChangeAccountModalVisible();

    getPaymentBankAccount();
  };

  const renderGeneralInformation = () =>
    paymentAccountInfo === null ? (
      <Skeleton />
    ) : (
      <>
        <div>
          <Title level={2}>Thông tin chung</Title>
          <p>Số tài khoản: {paymentAccountInfo.accountNumber}</p>
          <p>Chủ tài khoản: {profile.aliasName}</p>
          <p>Số dư: {paymentAccountInfo.overBalance} (VNĐ)</p>
        </div>
        <Button type="primary" onClick={handleChangeAccountClick}>
          Thay đổi tài khoản
        </Button>
      </>
    );

  const handleConfirmTransfer = () => {
    const {
      receiverAccountNumber,
      bankTypeId,
      deposit,
      transferMethodId,
      description,
    } = moneyTransferForm.getFieldsValue();

    // validate.
    const payload = {
      senderAccountNumber: paymentAccountNumber,
      receiverAccountNumber,
      bankTypeId,
      deposit,
      transferMethodId,
      description: description ?? "",
      transferTime: Date.now(),
    };

    fetch(process.env.REACT_APP_BILLING_API_URL_PATH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("accessToken"),
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        message.success("Successfully!!!");

        const isNotSavedReceiverBefore = receivers.every((value) => {
          return value.accountNumber !== receiverAccountNumber;
        });

        localStorage.setItem(
          "is-not-saved-receiver-before",
          isNotSavedReceiverBefore
        );
        localStorage.setItem(
          "current-receiver-account-number",
          receiverAccountNumber
        );

        toggleConfirmOtpModalVisibility();
        localStorage.setItem("billing-id", data._id);
      })
      .catch((error) => message.error(error));
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
        message.success("Successfully");
        toggleConfirmOtpModalVisibility();

        // Show Success Modal.
        const isNotSavedReceiverBefore = JSON.parse(
          localStorage.getItem("is-not-saved-receiver-before")
        );
        console.log("isNotSavedReceiverBefore", isNotSavedReceiverBefore);

        Modal.success({
          title: "Thành công",
          content: (
            <>
              {isNotSavedReceiverBefore && (
                <Checkbox id="saveReceiverCheckBox" defaultChecked={false}>
                  Lưu nguời nhận
                </Checkbox>
              )}
            </>
          ),
          onOk: () => {
            if (isNotSavedReceiverBefore) {
              let savedReceiverCheckbox = document.querySelector(
                "#saveReceiverCheckBox"
              );
              var isSaveReceiverChecked =
                savedReceiverCheckbox.checked === true;

              if (isSaveReceiverChecked) {
                const payload = {
                  senderAccountNumber: paymentAccountNumber,
                  receiverAccountNumber: localStorage.getItem(
                    "current-receiver-account-number"
                  ),
                };
                fetch(process.env.REACT_APP_RECEIVER_API_URL_PATH, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("accessToken"),
                  },
                  body: JSON.stringify(payload),
                })
                  .then((response) => {
                    message.success("Lưu người nhận thành công");
                    getReceivers();
                  })
                  .catch((error) => message.error("Lưu người nhận thất bại"));

                savedReceiverCheckbox.checked = false;
              }
            }

            moneyTransferForm.resetFields();
            setOtp("");
          },
        });
      })
      .catch((error) => {
        message.error(error);
      });
  };

  const handleMoneyTransferModalCancel = () => {
    toggleMoneyTransferModalVisible();
    moneyTransferForm.resetFields();
  };

  return (
    <CustomerLayout selected={"1"}>
      <Modal
        title="Xác nhận giao dịch"
        centered
        okText="Xác nhận"
        cancelText="Huỷ"
        onOk={handleConfirmOtp}
        onCancel={toggleConfirmOtpModalVisibility}
        open={confirmOtpModalVisibility}
      >
        <OTPInput
          autoFocus
          length={4}
          onChangeOTP={(value) => {
            setOtp(value);
          }}
        />
      </Modal>

      <Modal
        footer={null}
        title="Tài khoản ngân hàng"
        open={changeAccountModalVisibility}
        onCancel={toggleChangeAccountModalVisible}
      >
        <BankAccountList
          paymentAccount={paymentAccountInfo}
          onSelectPaymentAccountClick={handleSelectPaymentAccountClick}
          bankAccounts={bankAccounts}
        />
      </Modal>

      <Modal
        footer={null}
        title="Chuyển khoản"
        open={moneyTransferModalVisibility}
        onCancel={handleMoneyTransferModalCancel}
      >
        <MoneyTransferForm
          form={moneyTransferForm}
          receivers={receivers}
          bankTypes={bankTypes}
          transferMethods={transferMethods}
          onConfirmTransfer={handleConfirmTransfer}
        />
      </Modal>

      <GeneralInformationSection>
        {renderGeneralInformation()}
      </GeneralInformationSection>

      <ServiceSection>
        <ServiceList sources={services} />
      </ServiceSection>

      <HistorySection>
        <Title level={2}>Lịch sử giao dịch</Title>
        <Table dataSource={dataSource} columns={columns} />
      </HistorySection>
    </CustomerLayout>
  );
};
