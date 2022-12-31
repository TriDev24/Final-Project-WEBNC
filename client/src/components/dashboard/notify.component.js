import React, { useEffect, useState } from "react";
import { Dropdown, Button, Badge, Alert } from "antd";
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

  useEffect(() => {
    const paymentAccount = localStorage.getItem("payment-account-number");
    if (paymentAccount) {
      const fetchApi = async () => {
        const url = `${process.env.REACT_APP_DEBIT_URL_PATH}/notify/${paymentAccount}`;
        const result = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("accessToken"),
          },
        })
          .then((response) => response.json())
          .then((data) => data);
        const items = result.notifies.map((notify, index) => {
          let message = `Tài khoản ${notify.senderId.accountNumber} đã thanh toán nhắc nợ của bạn`;
          if (notify.statusId.name === "cancelled") {
            if (notify.side === "personal") {
              message = `Nhắc nợ của của tài khoản ${notify.senderId.accountNumber} đã bị hủy`;
            }else
                message = `Tài khoản ${notify.senderId.accountNumber} đã hủy nhắc nợ của bạn`;
          }
          return getItem(<Alert message={message} type="info" />, index);
        });
        setDropItems(items);
        setCount(result.count);
      };
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
        <Button icon={<BellOutlined />}></Button>
      </Badge>
    </Dropdown>
  );
}

export default Notify;
