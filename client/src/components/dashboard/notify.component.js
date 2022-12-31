import React, { useEffect, useState } from "react";
import { Dropdown, Button, Badge, Alert, Space } from "antd";
import { BellOutlined } from "@ant-design/icons";

const getItem = (label, key, icon, children) => {
  return {
    key,
    icon,
    children,
    label,
  };
};

function Notify() {
  const [dropItems, setDropItems] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false)

  const fetchApi = async () => {
    setLoading(true)
    const url = `${
      process.env.REACT_APP_NOTIFY_URL_PATH
    }/${localStorage.getItem("payment-account-number")}`;
    const result = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("accessToken"),
      },
    })
      .then((response) => response.json())
      .then((data) => data);
    let items = result.notifies.map((notify, index) => {
      let message = `Tài khoản ${notify.senderId.accountNumber} đã thanh toán nhắc nợ của bạn`;
      if (notify.statusId.name === "cancelled") {
        if (notify.side === "personal") {
          message = `Nhắc nợ của tài khoản ${notify.senderId.accountNumber} đã bị hủy`;
        } else
          message = `Tài khoản ${notify.senderId.accountNumber} đã hủy nhắc nợ của bạn`;
      }
      return getItem(
        <Alert
          message="Thông báo"
          description={message}
          type="info"
          action={
            <Space>
              <Button
                size="small"
                type="primary"
                onClick={(e) => handleClick(notify._id)}
              >
                Đã xem
              </Button>
            </Space>
          }
          closable
        />,
        index
      );
    });
    if (items.length === 0) {
      items = [getItem(`Không có thông báo`, 1)];
    }
    setDropItems(items);
    setCount(result.count);
    setLoading(false)
  };

  const handleClick = async (id) => {
    setLoading(true)
    const url = `${process.env.REACT_APP_NOTIFY_URL_PATH}/${id}`;
    const result = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("accessToken"),
      },
    })
      .then((response) => response.json())
      .then((data) => data);
    await fetchApi();
    setLoading(false)
  };

  useEffect(() => {
    const paymentAccount = localStorage.getItem("payment-account-number");
    if (paymentAccount) {
      fetchApi();
    }
  }, [localStorage.getItem("payment-account-number")]);

  return (
    <Dropdown
      menu={{
        items: dropItems,
      }}
      placement="bottomLeft"
      arrow={{
        pointAtCenter: true,
      }}
    >
      <Badge size="small" count={count}>
        <Button loading={loading} icon={<BellOutlined />}></Button>
      </Badge>
    </Dropdown>
  );
}

export default Notify;
