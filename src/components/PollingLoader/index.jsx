import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { Spin, notification } from "antd";
import { useNavigate } from "react-router-dom";
import "./index.css";

/**
 * 通用轮询加载组件
 * @param {Object} props
 * @param {Function} props.apiFunction - API请求函数
 * @param {string} props.resultPath - 结果页面路径
 * @param {Function} props.getFormData - 获取表单数据的函数，用于传递到结果页面
 * @param {Function} props.onSuccess - 成功回调（可选）
 * @param {Function} props.onError - 错误回调（可选）
 * @param {Function} props.onRedesign - 重新设计回调（可选）
 * @param {number} props.pollInterval - 轮询间隔（毫秒），默认5000
 * @param {number} props.patienceTimeout - 耐心等待提示时间（毫秒），默认10000
 * @param {Object} props.texts - 自定义文本（可选）
 */
const PollingLoader = forwardRef(({
  apiFunction,
  resultPath,
  getFormData,
  onSuccess,
  onError,
  onRedesign,
  pollInterval = 5000,
  patienceTimeout = 10000,
  texts = {},
}, ref) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);
  const [showResultButton, setShowResultButton] = useState(false);
  const [showErrorButton, setShowErrorButton] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [apiParams, setApiParams] = useState(null);
  const pollingTimerRef = useRef(null);
  const prevRemainingTimeRef = useRef(null);

  const [api, contextHolder] = notification.useNotification();

  // 默认文本
  const defaultTexts = {
    submitting: "Submitting task, please wait...",
    analyzing: "Analyzing, please wait...",
    remainingTime: "Estimated remaining time",
    seconds: "seconds",
    completed: "Design Completed!",
    viewResults: "View Results",
    taskFailed: "Task Execution Failed",
    redesign: "Redesign",
    tooLong: "Task analysis time is too long, please try again later",
    pleaseWait: "Please wait patiently, the design process may take a long time...",
    ...texts,
  };

  const openNotificationWithIcon = (type, errorMsg) => {
    api[type]({
      message: "Response Message",
      description: errorMsg,
    });
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (pollingTimerRef.current) {
        clearInterval(pollingTimerRef.current);
      }
    };
  }, []);

  // 开始轮询任务状态
  const startPolling = (params) => {
    // 清除之前的定时器
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current);
    }

    // 设置轮询定时器
    pollingTimerRef.current = setInterval(async () => {
      try {
        // 使用完整参数进行轮询
        const pollResponse = await apiFunction(params);

        console.log("Polling Response:", pollResponse);

        if (pollResponse && pollResponse.data) {
          // 第五种情况：任务运行成功，返回结果
          if (pollResponse.data.TableData || pollResponse.data.JbrowseInfo) {
            // 有结果，停止轮询，显示成功按钮
            if (pollingTimerRef.current) {
              clearInterval(pollingTimerRef.current);
              pollingTimerRef.current = null;
            }
            setIsPolling(false);
            setLoading(false);
            setShowResultButton(true);
            if (onSuccess) {
              onSuccess(pollResponse);
            }
          }
          // 第三种情况：任务正在分析中
          else if (pollResponse.data.msg === "任务正在分析中") {
            // 仍在分析中，更新剩余时间
            if (pollResponse.data.remaining_time_seconds !== undefined) {
              const currentRemainingTime =
                pollResponse.data.remaining_time_seconds;

              // 检测是否连续两次返回60秒（后端卡住的标志）
              if (
                currentRemainingTime === 60 &&
                prevRemainingTimeRef.current === 60
              ) {
                // 停止轮询，提示用户
                if (pollingTimerRef.current) {
                  clearInterval(pollingTimerRef.current);
                  pollingTimerRef.current = null;
                }
                setIsPolling(false);
                setLoading(false);
                setShowErrorButton(true);
                setErrorMessage(defaultTexts.tooLong);
                openNotificationWithIcon("warning", defaultTexts.tooLong);
                if (onError) {
                  onError("timeout");
                }
                return;
              }

              // 更新剩余时间：先保存当前值到ref，再更新state
              prevRemainingTimeRef.current = currentRemainingTime;
              setRemainingTime(currentRemainingTime);
            }
          }
          // 第一种情况：参数错误
          else if (
            pollResponse.data.msg === "任务之前执行失败" &&
            pollResponse.data.error
          ) {
            // 任务失败，停止轮询
            if (pollingTimerRef.current) {
              clearInterval(pollingTimerRef.current);
              pollingTimerRef.current = null;
            }
            setIsPolling(false);
            setLoading(false);
            setShowErrorButton(true);
            setErrorMessage(
              pollResponse.data.error || pollResponse.data.msg
            );
            openNotificationWithIcon(
              "error",
              "Invalid parameters, please check and resubmit"
            );
            if (onError) {
              onError(pollResponse.data);
            }
            return; // 停止继续执行
          }
          // 其他情况：检查是否是字符串错误（第四种情况）
          else if (typeof pollResponse.data === "string") {
            // 第四种情况：纯字符串错误响应
            if (pollingTimerRef.current) {
              clearInterval(pollingTimerRef.current);
              pollingTimerRef.current = null;
            }
            setIsPolling(false);
            setLoading(false);
            setShowErrorButton(true);
            const errorMsg = "Invalid parameters, please check and resubmit";
            setErrorMessage(errorMsg);
            openNotificationWithIcon("error", errorMsg);
            if (onError) {
              onError(pollResponse.data);
            }
            return; // 停止继续执行
          }
          // 其他未知情况
          else {
            // 继续轮询，等待结果
            console.log("Continue polling, waiting for result...");
          }
        } else if (pollResponse.error) {
          // 停止轮询
          if (pollingTimerRef.current) {
            clearInterval(pollingTimerRef.current);
            pollingTimerRef.current = null;
          }
          setIsPolling(false);
          setLoading(false);
          setShowErrorButton(true);
          setErrorMessage("Invalid parameters, please check and resubmit");
          openNotificationWithIcon("error", "Invalid parameters, please check and resubmit");
          if (onError) {
            onError("Invalid parameters, please check and resubmit");
          }
          return; // 停止继续执行
        } else if (typeof pollResponse === "string") {
          // 第四种情况：响应本身就是字符串错误
          if (pollingTimerRef.current) {
            clearInterval(pollingTimerRef.current);
            pollingTimerRef.current = null;
          }
          setIsPolling(false);
          setLoading(false);
          setShowErrorButton(true);
          const errorMsg = "Invalid parameters, please check and resubmit";
          setErrorMessage(errorMsg);
          openNotificationWithIcon("error", errorMsg);
          if (onError) {
            onError(pollResponse);
          }
          return; // 停止继续执行
        }
      } catch (error) {
        console.error("Polling Error:", error);
        // 检查是否是字符串错误响应
        if (error.response && typeof error.response.data === "string") {
          // 第四种情况：字符串错误
          if (pollingTimerRef.current) {
            clearInterval(pollingTimerRef.current);
            pollingTimerRef.current = null;
          }
          setIsPolling(false);
          setLoading(false);
          setShowErrorButton(true);
          const errorMsg = "Invalid parameters, please check and resubmit";
          setErrorMessage(errorMsg);
          openNotificationWithIcon("error", errorMsg);
          if (onError) {
            onError(error.response.data);
          }
          return; // 停止继续执行
        }
      }
    }, pollInterval);
  };

  // 处理提交
  const handleSubmit = async (params) => {
    if (!params) {
      openNotificationWithIcon("warning", "Please provide API parameters");
      return;
    }

    // 保存参数
    setApiParams(params);

    // 开始加载
    setLoading(true);
    setShowResultButton(false);
    setShowErrorButton(false);
    setErrorMessage("");
    setIsPolling(false);
    setRemainingTime(null);
    prevRemainingTimeRef.current = null;

    try {
      // 添加计时器，如果指定时间内没有返回结果，则提示用户耐心等待
      let timerTimeout = setTimeout(() => {
        openNotificationWithIcon("info", defaultTexts.pleaseWait);
      }, patienceTimeout);

      // 调用API
      const response = await apiFunction(params);

      // 清除计时器
      clearTimeout(timerTimeout);

      console.log("API Response:", response);

      // 处理响应
      if (response && response.data) {
        // 第一种情况：参数有误，提交失败
        if (
          response.data.msg === "任务之前执行失败" &&
          response.data.error
        ) {
          setLoading(false);
          setIsPolling(false);
          setShowErrorButton(true);
          setErrorMessage(response.data.error || response.data.msg);
          openNotificationWithIcon(
            "error",
            "Invalid parameters, please check and resubmit"
          );
          if (onError) {
            onError(response.data);
          }
        }
        // 第二种情况：第一次提交任务，提交成功
        else if (
          response.data.msg === "任务已提交" &&
          response.data.task_id
        ) {
          // 进入轮询
          setLoading(false);
          setIsPolling(true);
          // 初始化剩余时间相关的状态
          if (response.data.remaining_time_seconds !== undefined) {
            setRemainingTime(response.data.remaining_time_seconds);
            prevRemainingTimeRef.current =
              response.data.remaining_time_seconds;
          } else {
            prevRemainingTimeRef.current = null;
          }
          startPolling(params);
        }
        // 第三种情况：任务正在运行中
        else if (response.data.msg === "任务正在分析中") {
          setLoading(false);
          setIsPolling(true);
          if (response.data.remaining_time_seconds !== undefined) {
            setRemainingTime(response.data.remaining_time_seconds);
            prevRemainingTimeRef.current =
              response.data.remaining_time_seconds;
          } else {
            prevRemainingTimeRef.current = null;
          }
          startPolling(params);
        }
        // 第五种情况：任务运行成功，返回结果
        else if (
          response.data.TableData ||
          response.data.JbrowseInfo
        ) {
          setLoading(false);
          setIsPolling(false);
          setShowResultButton(true);
          if (onSuccess) {
            onSuccess(response);
          }
        }
        // 其他情况：可能是错误响应
        else {
          // 检查是否是字符串错误（第四种情况）
          if (
            typeof response.data === "string" ||
            (response.data &&
              !response.data.msg &&
              !response.data.TableData)
          ) {
            // 可能是第四种情况的错误
            setLoading(false);
            setIsPolling(false);
            setShowErrorButton(true);
            const errorMsg = typeof response.data === "string"
              ? "Invalid parameters, please check and resubmit"
              : "Error occurred during task execution";
            setErrorMessage(errorMsg);
            openNotificationWithIcon(
              "error",
              errorMsg
            );
            if (onError) {
              onError(response.data);
            }
          } else {
            // 未知响应格式，尝试进入轮询
            setLoading(false);
            setIsPolling(true);
            startPolling(params);
          }
        }
      }else if (response.error) {
        setLoading(false);
        setIsPolling(false);
        setShowErrorButton(true);
        setErrorMessage("Invalid parameters, please check and resubmit");
        openNotificationWithIcon("error", "Invalid parameters, please check and resubmit");
        if (onError) {
          onError("Invalid parameters, please check and resubmit");
        }
      }
       else {
        // 响应格式异常，尝试进入轮询
        setLoading(false);
        setIsPolling(true);
        startPolling(params);
      }
    } catch (error) {
      console.error("API Error:", error);

      // 处理不同的错误情况
      let errorMsg = "";
      if (error.response) {
        // 服务器返回了错误响应
        // 检查是否是第四种情况的字符串错误
        if (typeof error.response.data === "string") {
          errorMsg = "Invalid parameters, please check and resubmit";
        } else {
          errorMsg =
            error.response.data?.error ||
            error.response.data?.msg ||
            error.response.data?.message ||
            `Request failed: ${error.response.status}`;
        }
      } else if (error.request) {
        // 请求已发出但没有收到响应
        errorMsg = "Network error, please check your network connection";
      } else {
        // 其他错误
        errorMsg = error?.message || "Request failed, please try again later";
      }

      setLoading(false);
      setIsPolling(false);
      setShowErrorButton(true);
      setErrorMessage(errorMsg);
      openNotificationWithIcon("error", errorMsg);
      if (onError) {
        onError(error);
      }
    }
  };

  // 处理重新设计
  const handleRedesign = () => {
    // 清除轮询定时器
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current);
      pollingTimerRef.current = null;
    }
    setShowErrorButton(false);
    setErrorMessage("");
    setIsPolling(false);
    setLoading(false);
    setRemainingTime(null);
    prevRemainingTimeRef.current = null;
    if (onRedesign) {
      onRedesign();
    }
  };

  // 处理查看结果
  const handleViewResult = () => {
    if (!getFormData || !resultPath) {
      console.error("getFormData or resultPath is not provided");
      return;
    }

    // 获取表单数据
    const formData = getFormData();

    // 导航到结果页面，只传递表单参数
    navigate(resultPath, {
      state: {
        apiParams: formData,
      },
    });
    setShowResultButton(false);
  };

  // 暴露提交函数给父组件
  useImperativeHandle(ref, () => ({
    submit: (params) => {
      handleSubmit(params);
    },
    reset: () => {
      handleRedesign();
    },
  }));

  return (
    <>
      {contextHolder}
      {/* 全屏加载遮罩 */}
      {(loading || isPolling || showResultButton || showErrorButton) && (
        <div className="loading-overlay">
          <div className="loading-content">
            {showErrorButton ? (
              // 错误状态
              <>
                <div className="error-icon">✗</div>
                <p className="error-text">{defaultTexts.taskFailed}</p>
                <p className="error-message">{errorMessage}</p>
                <button className="redesign-btn" onClick={handleRedesign}>
                  {defaultTexts.redesign}
                </button>
              </>
            ) : showResultButton ? (
              // 成功状态
              <>
                <div className="success-icon">✓</div>
                <p className="success-text">{defaultTexts.completed}</p>
                <button
                  className="view-result-btn"
                  onClick={handleViewResult}
                >
                  {defaultTexts.viewResults}
                </button>
              </>
            ) : isPolling ? (
              // 轮询状态
              <>
                <Spin size="large" />
                <p className="loading-text">{defaultTexts.analyzing}</p>
                {remainingTime && (
                  <p className="remaining-time-text">
                    {defaultTexts.remainingTime}: {Math.ceil(remainingTime)}{" "}
                    {defaultTexts.seconds}
                  </p>
                )}
              </>
            ) : (
              // 初始加载状态
              <>
                <Spin size="large" />
                <p className="loading-text">{defaultTexts.submitting}</p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
});

PollingLoader.displayName = "PollingLoader";

export default PollingLoader;

