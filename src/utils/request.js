/* eslint-disable no-undef */
import axios from "axios";
import { message } from "antd";

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api", // 使用环境变量
  timeout: 600 * 1000, // 请求超时时间60秒
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么

    // 可以在这里添加token
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`;
    // }

    // 打印请求信息（开发环境）
    if (process.env.NODE_ENV === "development") {
      console.log("📤 请求发送:", {
        url: config.url,
        method: config.method?.toUpperCase(),
        data: config.data,
        params: config.params,
      });
    }

    return config;
  },
  (error) => {
    // 对请求错误做些什么
    console.error("❌ 请求错误:", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 2xx 范围内的状态码都会触发该函数

    // 打印响应信息（开发环境）
    if (process.env.NODE_ENV === "development") {
      console.log("📥 响应接收:", {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
    }

    // 直接返回响应数据
    return response;
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数

    console.error("❌ 响应错误:", error);

    // 根据不同的错误状态码进行处理
    const { response } = error;

    if (response) {
      const { status, data } = response;

      switch (status) {
        case 400:
          message.error(data?.message || "请求参数错误");
          break;
        case 401:
          message.error("未授权，请重新登录");
          // 可以在这里处理登录过期的逻辑
          // window.location.href = '/login';
          break;
        case 403:
          message.error("拒绝访问");
          break;
        case 404:
          message.error("请求的资源不存在");
          break;
        case 408:
          message.error("请求超时");
          break;
        case 500:
          message.error("服务器内部错误");
          break;
        case 502:
          message.error("网关错误");
          break;
        case 503:
          message.error("服务不可用");
          break;
        case 504:
          message.error("网关超时");
          break;
        default:
          message.error(data?.message || `请求失败 (${status})`);
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      message.error("网络错误，请检查网络连接");
    } else {
      // 发生了一些其他错误
      message.error(error.message || "请求失败");
    }

    return Promise.reject(error);
  }
);

/**
 * 通用请求方法
 * @param {Object} config - 请求配置
 * @param {string} config.url - 请求URL
 * @param {string} config.method - 请求方法
 * @param {Object} config.data - 请求数据(POST/PUT/PATCH)
 * @param {Object} config.params - URL参数(GET)
 * @param {Object} config.headers - 请求头
 * @param {boolean} config.showError - 是否显示错误提示，默认true
 * @param {boolean} config.showLoading - 是否显示loading，默认false
 * @returns {Promise} 返回Promise对象
 */
const request = async (config) => {
  const {
    url,
    method = "GET",
    data,
    params,
    headers = {},
    showError = true,
    showLoading = false,
    ...restConfig
  } = config;

  // 构建请求配置
  const requestConfig = {
    url,
    method: method.toUpperCase(),
    headers,
    ...restConfig,
  };

  // 根据请求方法添加数据
  if (["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
    requestConfig.data = data;
  } else {
    requestConfig.params = params;
  }

  try {
    if (showLoading) {
      // 可以在这里添加全局loading
    }

    const response = await service(requestConfig);

    return {
      success: true,
      data: response.data,
      status: response.status,
      headers: response.headers,
    };
  } catch (error) {
    if (!showError) {
      // 如果不显示错误，则清除已显示的错误提示
      message.destroy();
    }

    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status || 0,
    };
  } finally {
    if (showLoading) {
      // 关闭loading
    }
  }
};

// 便捷方法
const get = (url, params, config = {}) => {
  return request({
    url,
    method: "GET",
    params,
    ...config,
  });
};

const post = (url, data, config = {}) => {
  return request({
    url,
    method: "POST",
    data,
    ...config,
  });
};

const put = (url, data, config = {}) => {
  return request({
    url,
    method: "PUT",
    data,
    ...config,
  });
};

const patch = (url, data, config = {}) => {
  return request({
    url,
    method: "PATCH",
    data,
    ...config,
  });
};

const del = (url, config = {}) => {
  return request({
    url,
    method: "DELETE",
    ...config,
  });
};

// 导出
export default request;
export { get, post, put, patch, del, service };

// 创建一个带有loading的请求实例
export const requestWithLoading = (config) => {
  return request({
    showLoading: true,
    ...config,
  });
};

// 创建一个不显示错误提示的请求实例
export const silentRequest = (config) => {
  return request({
    showError: false,
    ...config,
  });
};
