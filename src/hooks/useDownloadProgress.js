import { useState } from "react";

/**
 * 下载进度 Hook
 * 用于处理 API 请求的下载进度
 * @returns {Object} { progress, text, setProgress, setText, createProgressHandler }
 */
export const useDownloadProgress = () => {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState("Initializing...");

  /**
   * 创建进度处理函数
   * @returns {Function} 可以传递给 axios onDownloadProgress 的回调函数
   */
  const createProgressHandler = () => {
    return (progressEvent) => {
      const { loaded, total } = progressEvent;

      if (total) {
        // 计算百分比
        const percentComplete = Math.round((loaded / total) * 100);
        setProgress(percentComplete);

        // 更新加载文本
        const loadedMB = (loaded / 1024 / 1024).toFixed(2);
        const totalMB = (total / 1024 / 1024).toFixed(2);
        setText(`Downloading data: ${loadedMB}MB / ${totalMB}MB`);
      } else {
        // 如果没有 total，只显示已下载大小
        const loadedMB = (loaded / 1024 / 1024).toFixed(2);
        setText(`Downloading data: ${loadedMB}MB`);
      }
    };
  };

  return {
    progress,
    text,
    setProgress,
    setText,
    createProgressHandler,
  };
};

