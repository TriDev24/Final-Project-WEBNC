import { Avatar, Button, Dropdown } from "antd";
import { ChangePasswordModal } from "../components/change-password.component.js";
import Logout from "../components/logout.component.js";

const getItem = (label, key, icon, children) => {
  return {
    key,
    icon,
    children,
    label,
  };
};



function IdentityOption({setAuth}) {

  const items = [
    getItem(<ChangePasswordModal></ChangePasswordModal>, "1"),
    getItem(<Logout setAuth={setAuth}></Logout>, "2"),
  ];

  return (
    <Dropdown
      menu={{
        items,
      }}
      placement="bottomLeft"
      arrow={{
        pointAtCenter: true,
      }}
      trigger={["click"]}
    >
      <Button
        type="ghost"
        shape="circle"
        icon={
          <Avatar
            style={{ marginBottom: "5px" }}
            src="/images/avatar.png"
          ></Avatar>
        }
      ></Button>
    </Dropdown>
  );
}

export default IdentityOption;
