import React, { useState } from "react";
import { Input, Select } from "antd";
import plasmidsImage from "@/assets/images/design/plasmids.png";
import usernameIcon from "@/assets/icon/username.svg";
import emailIcon from "@/assets/icon/email.svg";
import messageIcon from "@/assets/icon/message.svg";
import "./index.scss";

const { TextArea } = Input;
const { Option } = Select;
const Protocol = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    request: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // 这里可以添加提交表单的逻辑
  };

  return (
    <div className="plasmids-container">
      {/* 上部分：左图右文 */}
      <div className="plasmids-header">
        <div className="plasmids-image">
          <img src={plasmidsImage} alt="plasmids" />
        </div>
        <div className="plasmids-intro">
          <h1>Want to edit in my species?</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis
            consequatur eligendi quisquam doloremque vero ex debitis veritatis
            placeat unde animi laborum sapiente illo possimus, commodi
            dignissimos obcaecati illum maiores corporis.
          </p>
          <h1>How to do?</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod
            itaque voluptate nesciunt laborum incidunt. Officia, quam
            consectetur. Earum eligendi aliquam illum alias, unde optio
            accusantium soluta, iusto molestiae adipisci et?
          </p>
        </div>
      </div>

      {/* 下部分：表单 */}
      <form className="plasmids-form" onSubmit={handleSubmit}>
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
                setFormData((prev) => ({
                  ...prev,
                  firstName: e.target.value,
                }))
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
              <Option value="Request CRISPR plasmids">
                Request CRISPR plasmids
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
    </div>
  );
};

export default Protocol;
