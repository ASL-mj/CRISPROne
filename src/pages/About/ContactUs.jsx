import React, { useState, useEffect, useRef } from "react";
import { Input, Select, Spin } from "antd";
import usernameIcon from "@/assets/icon/username.svg";
import emailIcon from "@/assets/icon/email.svg";
import messageIcon from "@/assets/icon/message.svg";
import "./index.scss";

const { TextArea } = Input;
const { Option } = Select;

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    request: "",
    message: "",
  });

  const mapRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // 这里可以添加提交表单的逻辑
  };

  useEffect(() => {
    // 动态加载百度地图脚本
    const loadBaiduMapScript = () => {
      const script = document.createElement("script");
      script.src =
        "https://api.map.baidu.com/api?v=3.0&ak=SgGGjojoD3VqyUGXGz8R4uiE7nQWHlGk&callback=initBMap";
      script.async = true;
      document.body.appendChild(script);

      // 全局回调函数，百度地图加载完成后执行
      window.initBMap = () => {
        if (mapRef.current) {
          // 创建地图实例
          const map = new window.BMap.Map(mapRef.current);

          // 设置坐标点 (北京坐标)
          const point = new window.BMap.Point(114.36, 30.48);

          // 初始化地图，设置中心点坐标和地图级别
          map.centerAndZoom(point, 15);

          // 添加地图控件
          map.addControl(new window.BMap.NavigationControl());
          map.addControl(new window.BMap.ScaleControl());
          map.enableScrollWheelZoom();

          // 添加标记点
          const marker = new window.BMap.Marker(point);
          map.addOverlay(marker);

          // 启用百度地图默认交互功能
          map.enableRightClick(); // 右键菜单
          map.enableDoubleClickZoom(); // 双击缩放

          // 让用户通过百度地图默认方式获取地点信息
          // 用户可以右键点击查看"此处是什么"等选项
        }
      };
    };

    loadBaiduMapScript();

    // 清理函数
    return () => {
      if (window.initBMap) {
        delete window.initBMap;
      }
    };
  }, []);

  return (
    <div className="contact-us">
      <h1>Contact Us</h1>
      <div className="divider"></div>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName" className="form-label">
              <img src={usernameIcon} alt="user" width="16" height="16" />
              First Name:
            </label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="Please enter your first name"
              value={formData.firstName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, firstName: e.target.value }))
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName" className="form-label">
              Last Name:
            </label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Please enter your last name"
              value={formData.lastName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, lastName: e.target.value }))
              }
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <img src={emailIcon} alt="email" width="16" height="16" />
              E-mail:
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Please enter your email address"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="request" className="form-label">
              Request:
            </label>
            <Select
              id="request"
              placeholder="Please select..."
              value={formData.request}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, request: value }))
              }
              style={{ width: "100%" }}
              required
            >
              <Option value="Request Question">Request Question</Option>
              <Option value="Upload New Genomic Data">
                Upload New Genomic Data
              </Option>
              <Option value="Other">Other</Option>
            </Select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="message" className="form-label">
            <img src={messageIcon} alt="message" width="16" height="16" />
            Message:
          </label>
          <TextArea
            id="message"
            name="message"
            placeholder="Please enter your message..."
            value={formData.message}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, message: e.target.value }))
            }
            rows={5}
            required
          />
        </div>

        <div className="form-group">
          <button type="submit" className="submit-btn">
            Send Message
          </button>
        </div>
      </form>

      <div className="map-section">
        <h2>Our Location</h2>
        <div className="map-container">
          <div
            ref={mapRef}
            className="baidu-map"
            style={{ width: "100%", height: "400px" }}
          >
            {!window.BMap && <Spin tip="Loading map..." size="large" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
