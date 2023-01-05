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
