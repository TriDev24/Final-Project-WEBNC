import { styled } from "@xstyled/styled-components";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Skeleton,
} from "antd";
import { Collapse } from "antd";
import { ReceiverItem } from "./receiver-item.component.js";

const { Panel } = Collapse;

const { Option } = Select;

const Container = styled.div`
  margin: 20px 10px;
`;

const StyledDepositInput = styled(InputNumber)`
  width: 100%;
`;

export const MoneyTransferForm = ({
  form,
  receivers,
  bankTypes,
  transferMethods,
  onConfirmTransfer,
}) => {
  const handleReceiverItemClick = (receiver) => {
    form.setFieldsValue({
      receiverAccountNumber: receiver.accountNumber,
      bankTypeId: receiver.bankTypeId,
    });
  };

  const renderReceiverOptions = () =>
    receivers === null ? (
      <Skeleton />
    ) : (
      receivers.map((r) => (
        <ReceiverItem
          onSelectItemClick={handleReceiverItemClick}
          receiver={r}
        />
      ))
    );

  const renderBankTypeOptions = () =>
    bankTypes === null ? (
      <Skeleton />
    ) : (
      bankTypes.map((b) => <Option key={b._id}>{b.name}</Option>)
    );
  const renderTransferMethodOptions = () =>
    transferMethods === null ? (
      <Skeleton />
    ) : (
      transferMethods.map((t) => (
        <Radio value={t._id}>
          {t.name === "Sender Pay Transfer Fee"
            ? "Người gửi thanh toán"
            : "Người nhận thanh toán"}
        </Radio>
      ))
    );

  return (
    <Container>
      <Form form={form} layout="vertical">
        <Form.Item
          name="receiverAccountNumber"
          label="Số tài khoản người nhận"
          rules={[
            {
              required: true,
              message: "Mời bạn nhập số tài khoản của người nhận",
            },
          ]}
        >
          <Input placeholder="Ví dụ: 012345678910" />
        </Form.Item>
        <Form.Item
          name="bankTypeId"
          label="Loại ngân hàng"
          rules={[
            {
              required: true,
              message: "Mời bạn chọn loại ngân hàng",
            },
          ]}
        >
          <Select>{renderBankTypeOptions()}</Select>
        </Form.Item>
        <Form.Item>
          <Collapse defaultActiveKey={["1"]}>
            <Panel header="Hoặc chọn người nhận từ danh sách đã lưu" key="1">
              {renderReceiverOptions()}
            </Panel>
          </Collapse>
        </Form.Item>

        <Form.Item
          name="deposit"
          label="Số tiền chuyển"
          rules={[
            {
              required: true,
              message: "Mời bạn nhập số tiền cần chuyển",
            },
          ]}
        >
          <StyledDepositInput addonAfter="VNĐ" placeholder="Ví dụ: 200000" />
        </Form.Item>
        <Form.Item
          name="transferMethodId"
          label="Hình thức thanh toán phí"
          rules={[
            {
              required: true,
              message: "Mời bạn chọn hình thức thanh toán phí",
            },
          ]}
        >
          <Radio.Group>{renderTransferMethodOptions()}</Radio.Group>
        </Form.Item>
        <Form.Item name="description" label="Nội dung chuyển khoản">
          <Input placeholder="Ví dụ: Tiền cà phê hôm trước" />
        </Form.Item>

        <Button type="primary" block onClick={onConfirmTransfer}>
          Xác nhận
        </Button>
      </Form>
    </Container>
  );
};
