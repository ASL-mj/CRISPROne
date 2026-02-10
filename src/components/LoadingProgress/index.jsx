import { Progress } from "antd";
import "./index.css";

/**
 * 加载进度组件
 * @param {number} percent - 进度百分比 (0-100)
 * @param {string} text - 加载文本提示
 */
const LoadingProgress = ({ percent = 0, text = "Loading..." }) => {
  return (
    <div className="loading-progress-container">
      <div className="loading-progress-content">
        <Progress
          percent={percent}
          status="active"
          strokeColor={{
            "0%": "#108ee9",
            "100%": "#87d068",
          }}
        />
        <p className="loading-progress-text">{text}</p>
      </div>
    </div>
  );
};

export default LoadingProgress;

