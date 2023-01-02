import React, { useEffect, useState } from "react";
import {
  Dropdown,
  Button,
  Badge,
  Alert,
  Space,
  notification,
  Typography,
} from "antd";
import { BellOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const getItem = (label, key, icon, children) => {
  return {
    key,
    icon,
    children,
    label,
  };
};

function NotifyMessage({ message, time, id, fetchApi, setLoading }) {
  const handleClick = async () => {
    setLoading(true);
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
    setLoading(false);
  };

  return (
    <Space direction="vertical">
      <Title level={5}>Thông báo</Title>
      <Text>{message}</Text>
      <Text type="secondary">{time}</Text>
      <Space style={{textAlign:"right"}}>
        <Button size="small" danger onClick={handleClick}>
          Xóa
        </Button>
      </Space>
    </Space>
  );
}

function Notify() {
  const [dropItems, setDropItems] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchApi = async () => {
    setLoading(true);
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
        <NotifyMessage
          message={message}
          time={new Date(parseInt(notify.createdAt)).toLocaleString()}
          id={notify._id}
          setLoading={setLoading}
          fetchApi={fetchApi}
        ></NotifyMessage>,
        index
      );
    });
    if (items.length === 0) {
      items = [getItem(`Không có thông báo`, 1)];
    }
    setDropItems(items);
    setCount(result.count);
    setLoading(false);
  };

  useEffect(() => {
    const paymentAccount = localStorage.getItem("payment-account-number");
    const ws = new WebSocket("ws://localhost:40567");
    if (paymentAccount) {
      fetchApi();

      ws.onopen = (event) => {
        ws.send(`${paymentAccount}`);
      };
      ws.onmessage = async function (event) {
        const message = event.data;
        if (message === paymentAccount) {
          setLoading(true);
          await fetchApi();
          setLoading(false);
          notification.open({
            message: "Thông báo",
            description:
              "Bạn có thông báo mới về nhắc nợ, hãy kiểm tra trong danh sách nhắc nợ",
            placement: "top",
          });
        }
      };
    }
    return () => ws.close();
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
      trigger={['click']}
    >
      <Badge size="small" count={count}>
        <Button loading={loading} icon={<BellOutlined />}></Button>
      </Badge>
    </Dropdown>
  );
}

export default Notify;
