import React from "react";
import LoginForm from "../components/login.component.js";

const LoginPage = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: "url(/images/background.jpg)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          border: "1px solid white",
          borderRadius: "20px",
          backgroundColor: "white",
        }}
      >
        <LoginForm></LoginForm>
      </div>
    </div>
  );
};

export default LoginPage
