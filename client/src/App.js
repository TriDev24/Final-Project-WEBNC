import { Routes, Route, Navigate } from "react-router-dom";
import { DashBoardPage, default as LoginPage } from "./pages/index.js";
import "antd/dist/reset.css";

export const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />}>
        </Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/dashboard" element={<DashBoardPage />}></Route>
      </Routes>
    </>
  );
};
