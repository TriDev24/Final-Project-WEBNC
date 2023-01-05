import { Modal, Button } from "antd";
import { useMemo, useState } from "react";
import { ManagementList } from "../../components/management-list.component.js";
import { BankTransactionHistoryForm } from "../../components/bank-transaction-history-form.component.js";
import styled from "@xstyled/styled-components";
import Title from "antd/es/typography/Title.js";
import { CreateEmployeeForm } from "../../components/create-employee-form.component.js";
import ContentLayout from "../../components/common/content-layout.component.js";

export const AdminDashboardPage = () => {
  const [
    isBankTransactionHistoryModalVisible,
    setBankTransactionHistoryModalVisibility,
  ] = useState(false);

  const toggleBankTransactionHistoryModalVisibility = () => {
    setBankTransactionHistoryModalVisibility(
      !isBankTransactionHistoryModalVisible
    );
  };

  const [isAddEmloyeeModalVisible, setAddEmloyeeModalVisibility] =
    useState(false);

  const handleAddEmloyeeClick = () => {
    setAddEmloyeeModalVisibility(!isAddEmloyeeModalVisible);
  };

  const renderListEmployee = () => {
    // if (!paymentAccountHistory) {
    //     return <Skeleton />;
    // } else {
    //     // Nhan tien
    //     const receiveBillings = paymentAccountHistory.filter(
    //         (p) => p.type === 'receive'
    //     );
    //     const mappedReceiveBillingDataSource = receiveBillings.map((r, index) => {
    //         return {
    //             key: index,
    //             senderAccountNumber: r.sender.accountNumber,
    //             receiverAccountNumber: 'Tôi',
    //             transferMoney: r.deposit,
    //             description: r.description,
    //             transferTime: r.transferTime,
    //         };
    //     });

    //     // Chuyen tien
    //     const transferBillings = paymentAccountHistory.filter(
    //         (p) => p.type === 'transfer'
    //     );
    //     const mappedTransferBillingDataSource = transferBillings.map(
    //         (t,index) => {
    //             return {
    //                 key: index,
    //                 senderAccountNumber: 'Tôi',
    //                 receiverAccountNumber: t.receiver.accountNumber,
    //                 transferMoney: t.deposit,
    //                 description: t.description,
    //                 transferTime: t.transferTime,
    //             };
    //         }
    //     );

    //     // Nhac no
    //     const debitBillings = paymentAccountHistory.filter(
    //         (p) => p.type === 'debit'
    //     );
    //     const mappedDebitBillingDataSource = debitBillings.map((d,index) => {
    //         return {
    //             key: index,
    //             senderAccountNumber: 'Tôi',
    //             receiverAccountNumber: d.receiver.accountNumber,
    //             transferMoney: d.deposit,
    //             description: d.description,
    //             transferTime: d.transferTime,
    //         };
    //     });

        // return (
        //     <>
        //         <p>
        //             <strong>
        //                 <i>Giao dịch nhận tiền</i>
        //             </strong>
        //         </p>
        //         <Table
        //             columns={historyColumns}
        //             dataSource={mappedReceiveBillingDataSource}
        //         />
        //         <p>
        //             <strong>
        //                 <i>Giao dịch chuyển tiền</i>
        //             </strong>
        //         </p>
        //         <Table
        //             columns={historyColumns}
        //             dataSource={mappedTransferBillingDataSource}
        //         />
        //         <p>
        //             <strong>
        //                 <i>Giao dịch thanh toán nhắc nợ</i>
        //             </strong>
        //         </p>
        //         <Table
        //             columns={historyColumns}
        //             dataSource={mappedDebitBillingDataSource}
        //         />
        //     </>
        // );
    }


  const ListEmployee = styled.div``;

  const settingItems = useMemo(
    () => [
      {
        title: "Xem danh sách giao dịch trong tháng với các ngân hàng khác",
        description:
          "Xem được các giao dịch: Xem trong khoảng thời gian. Xem theo từng ngân hàng, hoặc tất cả ngân hàng liên kết. Có thống kê tổng số tiền đã giao dịch",
        actionTitle: "Xem lịch sử",
        onItemClick: toggleBankTransactionHistoryModalVisibility,
      },
    ],
    []
  );

  return (
    <ContentLayout>
      <ListEmployee>
        <Title level={2}>Danh sách nhân viên</Title>
        {renderListEmployee}
      </ListEmployee>
      <Button type="primary" onClick={handleAddEmloyeeClick}>
        Thêm nhân viên
      </Button>
      <Modal
        title="Thêm nhân viên"
        centered
        open={isAddEmloyeeModalVisible}
        onOk={handleAddEmloyeeClick}
        onCancel={handleAddEmloyeeClick}
      >
        <CreateEmployeeForm />
      </Modal>
      <Modal
        title="Theo dõi lịch sử giao dịch các ngân hàng"
        centered
        open={isBankTransactionHistoryModalVisible}
        onOk={toggleBankTransactionHistoryModalVisibility}
        onCancel={toggleBankTransactionHistoryModalVisibility}
      >
        <BankTransactionHistoryForm />
      </Modal>
      <ManagementList sources={settingItems} />
    </ContentLayout>
  );
};
