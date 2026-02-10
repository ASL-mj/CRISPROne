import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "@/components/Head";
import Foot from "@/components/Foot";

const AppLayout = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
      }}
    >
      {/* 导航栏 */}
      <Navigation />

      {/* 主内容区域 */}
      <div
        style={{
          minHeight: "58vh",
        }}
      >
        <Outlet />
      </div>

      {/* 页脚 */}
      <Foot />
    </div>
  );
};

export default AppLayout;
