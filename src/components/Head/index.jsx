import React, { useState } from "react";
import { Menu, Drawer, Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MenuOutlined,
  WechatOutlined,
  BilibiliOutlined,
  FacebookOutlined,
  TwitterOutlined,
  GithubOutlined,
} from "@ant-design/icons";
import { navItems } from "./Links";
import DNAIcon from "@/assets/icon/DNAIcon";
import "./index.css";

const NavSwiper = () => {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 图标映射
  const iconMap = {
    ApiOutlined: <DNAIcon />,
  };

  // 将 navItems 转换为 Menu 组件所需的格式
  const menuItems = navItems.map((item) => ({
    key: item.path,
    label: item.label,
    children: item.children
      ? item.children.map((child) => ({
          key: child.path,
          label: child.label,
          icon: child.icon ? iconMap[child.icon] : undefined,
        }))
      : undefined,
  }));

  const handleMenuClick = ({ key }) => {
    navigate(key);
    setMobileMenuVisible(false); // 移动端点击后关闭抽屉
  };

  const showMobileMenu = () => {
    setMobileMenuVisible(true);
  };

  const hideMobileMenu = () => {
    setMobileMenuVisible(false);
  };

  return (
    <div className="navigation-menu-container">
      {/* 桌面端导航菜单 */}
      <div className="desktop-nav">
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{
            borderBottom: "none",
            backgroundColor: "transparent",
            fontSize: "13px",
            fontWeight: "600",
          }}
        />
      </div>

      {/* 移动端菜单按钮 */}
      <div className="mobile-nav-button">
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={showMobileMenu}
          style={{
            fontSize: "18px",
            height: "40px",
            width: "40px",
          }}
        />
      </div>

      {/* 移动端抽屉菜单 */}
      <Drawer
        title="导航菜单"
        placement="right"
        onClose={hideMobileMenu}
        open={mobileMenuVisible}
        width={280}
      >
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{
            border: "none",
            fontSize: "16px",
          }}
        />
      </Drawer>
    </div>
  );
};

const Navigation = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* 头部信息区域 */}
      <div className="navigation-header">
        <div className="navigation-logo">
          <img src="/logo.png" alt="logo" onClick={() => navigate("/")} />
          <span>
            CRISPRone：An improved CRISPR/Cas protein tool for genome editing in
            plants
          </span>
        </div>
        <div className="navigation-social">
          <div className="head-social-media-title">
            Follow CRISPRone on social media
          </div>
          <ul className="head-social-media-list">
            <li>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <WechatOutlined aria-label="WeChat" />
              </a>
            </li>
            <li>
              <a
                href="https://space.bilibili.com/62795729"
                target="_blank"
                rel="noopener noreferrer"
              >
                <BilibiliOutlined aria-label="Bilibili" />
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/mdbootstrap"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookOutlined aria-label="Facebook" />
              </a>
            </li>
            <li>
              <a
                href="https://github.com/tiramisutes"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubOutlined aria-label="Github" />
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/hopetogy"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterOutlined aria-label="Twitter" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* 导航菜单区域 */}
      <NavSwiper />
    </>
  );
};

export default Navigation;
