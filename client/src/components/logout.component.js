import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { LogoutOutlined } from "@ant-design/icons";
import { getProfileFromLocalStorage } from "../utils/local-storage.util.js";

function Logout({setAuth}) {
  const navigate = useNavigate();

  const handleClick = () => {
    localStorage.clear();
    setAuth(getProfileFromLocalStorage())
    navigate("/login");
  };

  return (
    <Button style={{width:"135px"}} icon={<LogoutOutlined />} onClick={handleClick}>
      Đăng xuất
    </Button>
  );
}

export default Logout;
