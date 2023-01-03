import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { LogoutOutlined } from "@ant-design/icons";
import { useStore, actions } from "../store";

function Logout() {
  const navigate = useNavigate();
  const [state, dispatch] = useStore()

  const handleClick = () => {
    localStorage.clear();
    dispatch(actions.setAuth(false));
    navigate("/login");
  };

  return (
    <Button style={{width:"135px"}} icon={<LogoutOutlined />} onClick={handleClick}>
      Đăng xuất
    </Button>
  );
}

export default Logout;
