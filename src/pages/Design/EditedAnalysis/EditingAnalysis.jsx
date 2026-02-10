import React, { useState } from "react";
import { InfoCircleOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import {
  InputNumber,
  Upload,
  Button,
  message,
  notification,
  Progress,
  Tooltip,
  Steps,
  Input,
  Select,
  Pagination,
  Empty,
} from "antd";
import {
  UploadOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  FileZipOutlined,
  NumberOutlined,
  SearchOutlined,
  FileOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import SparkMD5 from "spark-md5";
import editingAnalysisImage from "@/assets/images/design/edited_analy/editing_anal.png";
import {
  editedAnalysis,
  uploadFile,
  getTask,
} from "@/utils/api/editedAnalysis";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import { useEffect } from "react";

const EditingAnalysis = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fq_files_md5: "",
    target_file_md5: "",
    start: "",
    end: "",
  });
  const [api, contextHolder] = notification.useNotification();
  const [resultFiles, setResultFiles] = useState([]); // 存储结果文件
  const [resultPackage, setResultPackage] = useState(""); // 存储下载包
  const [taskId, setTaskId] = useState(""); // 存储任务ID
  const [taskStatus, setTaskStatus] = useState(null); // 任务状态：analysis, success, partial_success, failure
  const [progress, setProgress] = useState(0); // 任务进度
  const [currentStep, setCurrentStep] = useState(0); // 当前步骤
  const [elapsedTime, setElapsedTime] = useState(0); // 已用时间
  const [estimatedTime, setEstimatedTime] = useState(0); // 预计总时间
  const [createTime, setCreateTime] = useState(null); // 任务创建时间
  const [errorReason, setErrorReason] = useState(""); // 错误原因
  const [partialErrors, setPartialErrors] = useState({}); // 部分成功的错误信息
  const [historyTasks, setHistoryTasks] = useState([]); // 历史任务列表

  // 文件列表搜索和分页状态
  const [fileSearchText, setFileSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // 文件上传进度状态
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploading, setUploading] = useState({});

  const openNotificationWithIcon = (type, errorMsg) => {
    api[type]({
      message: "Response Message",
      description: errorMsg,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 验证必填字段
    if (!formData.fq_files_md5) {
      openNotificationWithIcon(
        "warning",
        "Please upload Sequencing fastq.zip file"
      );
      return;
    }

    if (!formData.target_file_md5) {
      openNotificationWithIcon("warning", "Please upload Target file");
      return;
    }

    if (formData.start === "" || formData.start === null) {
      openNotificationWithIcon("warning", "Please enter Start value");
      return;
    }

    if (formData.end === "" || formData.end === null) {
      openNotificationWithIcon("warning", "Please enter End value");
      return;
    }

    setLoading(true);

    try {
      const response = await editedAnalysis(formData);
      const responseData = response.data;

      // 设置任务ID
      const taskId = responseData.task_id || "";
      setTaskId(taskId);

      // 根据不同状态处理
      switch (responseData.status) {
        case "success":
          // 任务已存在且成功
          openNotificationWithIcon(
            "success",
            "Analysis completed successfully!"
          );
          console.log("API response:", responseData);
          setResultFiles(responseData.data.files || []);
          setResultPackage(responseData.data.package || "");
          setTaskStatus("success");
          setProgress(100);

          // 保存成功的任务到本地存储
          saveTaskToLocalStorage({
            taskId,
            status: "success",
            files: responseData.data.files || [],
            package: responseData.data.package || "",
            timestamp: new Date().toISOString(),
          });
          break;

        case "partial_success":
          // 任务已存在，部分成功
          openNotificationWithIcon(
            "warning",
            "Analysis partially completed with some errors."
          );
          console.log("API response:", responseData);
          setResultFiles(responseData.data.files || []);
          setResultPackage(responseData.data.package || "");
          setTaskStatus("partial_success");
          setProgress(100);

          // 提取部分错误信息
          const errors = {};
          Object.keys(responseData.data).forEach((key) => {
            if (
              key !== "files" &&
              key !== "package" &&
              typeof responseData.data[key] === "object"
            ) {
              errors[key] = responseData.data[key].error || "Unknown error";
            }
          });
          setPartialErrors(errors);

          // 保存部分成功的任务到本地存储
          saveTaskToLocalStorage({
            taskId,
            status: "partial_success",
            files: responseData.data.files || [],
            package: responseData.data.package || "",
            partialErrors: errors,
            timestamp: new Date().toISOString(),
          });
          break;

        case "analysis":
          // 任务已存在，正在分析中或新任务提交成功
          openNotificationWithIcon(
            "info",
            responseData.message || "Analysis in progress"
          );
          console.log("API response:", responseData);
          setTaskStatus("analysis");

          // 设置预计时间和创建时间
          if (responseData.create_time) {
            setCreateTime(responseData.create_time);
          }
          if (responseData.estimated_time) {
            setEstimatedTime(responseData.estimated_time);
          }

          // 清空结果
          setResultFiles([]);
          setResultPackage("");
          break;

        case "failure":
          // 任务已存在，失败
          openNotificationWithIcon(
            "error",
            responseData.reason || "Analysis failed"
          );
          console.log("API response:", responseData);
          setTaskStatus("failure");
          setErrorReason(responseData.reason || "Unknown error");
          break;

        default:
          // 其他情况
          message.error(
            responseData.error?.message || "Failed to submit analysis"
          );
          setTaskStatus("failure");
          setErrorReason("Unknown error");
      }
    } catch (error) {
      console.error("Submission error:", error);
      openNotificationWithIcon("error", "Failed to submit analysis");
    } finally {
      setLoading(false);
    }
  };
  // 保存任务数据到本地存储
  const saveTaskToLocalStorage = (taskData) => {
    try {
      // 获取现有的任务列表
      const existingTasksJson = localStorage.getItem("editingAnalysisTasks");
      let existingTasks = existingTasksJson
        ? JSON.parse(existingTasksJson)
        : [];

      // 检查任务是否已存在
      const existingTaskIndex = existingTasks.findIndex(
        (task) => task.taskId === taskData.taskId
      );

      if (existingTaskIndex !== -1) {
        // 更新现有任务
        existingTasks[existingTaskIndex] = taskData;
      } else {
        // 添加新任务
        existingTasks.push(taskData);
      }

      // 限制存储的任务数量，只保留最近的10个
      if (existingTasks.length > 10) {
        existingTasks = existingTasks.slice(-10);
      }

      // 保存回本地存储
      localStorage.setItem(
        "editingAnalysisTasks",
        JSON.stringify(existingTasks)
      );

      // 更新历史任务列表
      setHistoryTasks(existingTasks);
    } catch (error) {
      console.error("Error saving task to local storage:", error);
    }
  };

  // 加载历史任务数据
  useEffect(() => {
    try {
      const tasksJson = localStorage.getItem("editingAnalysisTasks");
      if (tasksJson) {
        const tasks = JSON.parse(tasksJson);
        setHistoryTasks(tasks);

        // 如果当前没有活动任务，但有历史任务，显示最近的一个成功或部分成功的任务
        if (!taskId && tasks.length > 0) {
          const recentSuccessTask = tasks.find(
            (task) =>
              task.status === "success" || task.status === "partial_success"
          );

          if (recentSuccessTask) {
            setTaskId(recentSuccessTask.taskId);
            setTaskStatus(recentSuccessTask.status);
            setResultFiles(recentSuccessTask.files || []);
            setResultPackage(recentSuccessTask.package || "");
            if (recentSuccessTask.partialErrors) {
              setPartialErrors(recentSuccessTask.partialErrors);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error loading tasks from local storage:", error);
    }
  }, []);

  // 处理文件点击事件，跳转到结果页面
  const handleFileClick = (fileName) => {
    if (taskId) {
      // 导航到结果页面，并传递任务ID和文件名
      navigate(
        `/edited-analysis/editing-analysis/result?taskId=${taskId}&fileName=${fileName}`
      );
    }
  };

  // 轮询任务状态
  useEffect(() => {
    let intervalId;

    if (taskId && taskStatus === "analysis") {
      // 根据已用时间和预计时间动态调整轮询间隔
      const pollInterval = Math.min(
        Math.max(2000, estimatedTime > 0 ? (estimatedTime / 10) * 1000 : 3000),
        5000
      );

      intervalId = setInterval(async () => {
        try {
          const response = await getTask({ task_id: taskId });
          const taskData = response.data;

          switch (taskData.status) {
            case "analysis":
              // 任务仍在分析中，更新进度信息
              if (taskData.current_step) {
                setCurrentStep(taskData.current_step);
                // 根据步骤计算进度百分比（1-4步骤，对应25%-100%）
                const progressPercent = Math.min(
                  Math.round((taskData.current_step / 4) * 100),
                  99
                );
                setProgress(progressPercent);
              }

              if (taskData.elapsed_time) {
                setElapsedTime(taskData.elapsed_time);
              }

              if (taskData.estimated_time) {
                setEstimatedTime(taskData.estimated_time);
              }

              if (taskData.create_time) {
                setCreateTime(taskData.create_time);
              }
              break;

            case "success":
              // 任务完成，设置结果并停止轮询
              setResultFiles(taskData.data.files || []);
              setResultPackage(taskData.data.package || "");
              setTaskStatus("success");
              setProgress(100);
              clearInterval(intervalId);
              openNotificationWithIcon(
                "success",
                "Analysis completed successfully!"
              );

              // 保存成功的任务到本地存储
              saveTaskToLocalStorage({
                taskId,
                status: "success",
                files: taskData.data.files || [],
                package: taskData.data.package || "",
                timestamp: new Date().toISOString(),
              });
              break;

            case "partial_success":
              // 任务部分完成，设置结果并停止轮询
              setResultFiles(taskData.data.files || []);
              setResultPackage(taskData.data.package || "");
              setTaskStatus("partial_success");
              setProgress(100);
              clearInterval(intervalId);

              // 提取部分错误信息
              const errors = {};
              Object.keys(taskData.data).forEach((key) => {
                if (
                  key !== "files" &&
                  key !== "package" &&
                  typeof taskData.data[key] === "object"
                ) {
                  errors[key] = taskData.data[key].error || "Unknown error";
                }
              });
              setPartialErrors(errors);

              openNotificationWithIcon(
                "warning",
                "Analysis partially completed with some errors."
              );

              // 保存部分成功的任务到本地存储
              saveTaskToLocalStorage({
                taskId,
                status: "partial_success",
                files: taskData.data.files || [],
                package: taskData.data.package || "",
                partialErrors: errors,
                timestamp: new Date().toISOString(),
              });
              break;

            case "failure":
              // 任务失败，停止轮询
              setTaskStatus("failure");
              setErrorReason(taskData.reason || "Unknown error");
              clearInterval(intervalId);
              openNotificationWithIcon(
                "error",
                "Analysis failed: " + (taskData.reason || "Unknown error")
              );
              break;

            default:
              // 未知状态，停止轮询
              setTaskStatus("failure");
              setErrorReason("Unknown status: " + taskData.status);
              clearInterval(intervalId);
              openNotificationWithIcon("error", "Unknown task status");
          }
        } catch (error) {
          console.error("Task status check error:", error);
          // 错误处理，但不停止轮询，除非错误次数过多
        }
      }, pollInterval);
    }

    // 组件卸载时清除定时器
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [taskId, taskStatus, estimatedTime]);

  // 渲染任务状态和进度
  const renderTaskStatus = () => {
    if (!taskId || !taskStatus) return null;

    // 计算预计完成时间
    let estimatedCompletionTime = null;
    if (createTime && estimatedTime > 0) {
      const createDate = new Date(createTime);
      const completionDate = new Date(
        createDate.getTime() + estimatedTime * 1000
      );
      estimatedCompletionTime = completionDate.toLocaleTimeString();
    }

    return (
      <div className={styles.taskStatusContainer}>
        <div className={styles.taskStatusHeader}>
          <h3>Analysis Task Status</h3>
          {historyTasks.length > 0 && (
            <div className={styles.taskHistorySelect}>
              <span>History Tasks: </span>
              <Select
                value={taskId}
                style={{ width: 220 }}
                onChange={(value) => {
                  // 查找选中的历史任务
                  const selectedTask = historyTasks.find(
                    (task) => task.taskId === value
                  );
                  if (selectedTask) {
                    // 设置当前任务为选中的历史任务
                    setTaskId(selectedTask.taskId);
                    setTaskStatus(selectedTask.status);
                    setResultFiles(selectedTask.files || []);
                    setResultPackage(selectedTask.package || "");
                    if (selectedTask.partialErrors) {
                      setPartialErrors(selectedTask.partialErrors);
                    }
                  }
                }}
              >
                {historyTasks.map((task) => (
                  <Select.Option key={task.taskId} value={task.taskId}>
                    {task.taskId}
                  </Select.Option>
                ))}
              </Select>
            </div>
          )}
        </div>
        <div className={styles.taskStatusContent}>
          <div className={styles.taskStatusIcon}>
            {taskStatus === "success" ? (
              <CheckCircleOutlined className={`${styles.statusIcon} ${styles.completed}`} />
            ) : taskStatus === "partial_success" ? (
              <CheckCircleOutlined className={`${styles.statusIcon} ${styles.partial}`} />
            ) : taskStatus === "failure" ? (
              <span className={`${styles.statusIcon} ${styles.failed}`}>❌</span>
            ) : (
              <SyncOutlined spin className={`${styles.statusIcon} ${styles.running}`} />
            )}
          </div>
          <div className={styles.taskStatusInfo}>
            <div className={styles.taskId}>Task ID: {taskId}</div>
            <div className={styles.taskStatus}>
              Status:{" "}
              {taskStatus === "analysis"
                ? "Analyzing"
                : taskStatus === "success"
                ? "Completed"
                : taskStatus === "partial_success"
                ? "Partially Completed"
                : "Failed"}
            </div>

            {/* 分析中状态显示进度和时间信息 */}
            {taskStatus === "analysis" && (
              <>
                <div className={styles.taskStep}>Current Step: {currentStep}/4</div>
                <div className={styles.taskTime}>
                  Elapsed Time: {elapsedTime}s
                  {estimatedTime > 0 && (
                    <> / Estimated Total Time: {estimatedTime}s</>
                  )}
                </div>
                {estimatedCompletionTime && (
                  <div className={styles.taskCompletionTime}>
                    Estimated Completion Time: {estimatedCompletionTime}
                  </div>
                )}
                <div className={styles.taskProgress}>
                  <Progress percent={progress} status="active" />
                </div>
              </>
            )}

            {/* 失败状态显示错误原因 */}
            {taskStatus === "failure" && errorReason && (
              <div className={styles.taskError}>
                <div className={styles.errorTitle}>Error Reason:</div>
                <div className={styles.errorMessage}>{errorReason}</div>
              </div>
            )}

            {/* 部分成功状态显示部分错误信息 */}
            {taskStatus === "partial_success" &&
              Object.keys(partialErrors).length > 0 && (
                <div className={styles.taskPartialErrors}>
                  <div className={styles.errorTitle}>Some Files Failed Analysis:</div>
                  {Object.entries(partialErrors).map(([file, error]) => (
                    <div key={file} className={styles.partialErrorItem}>
                      <span className={styles.fileName}>{file}:</span> {error}
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      </div>
    );
  };

  // 获取文件图标
  const getFileIcon = () => {
    return <FileOutlined className={styles.fileIconSymbol} />;
  };

  // 处理文件搜索
  const handleFileSearch = (e) => {
    setFileSearchText(e.target.value);
    setCurrentPage(1); // 重置到第一页
  };

  // 处理分页变化
  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  // 渲染结果文件列表
  const renderResults = () => {
    if (resultFiles.length > 0) {
      // 筛选文件
      let filteredFiles = [...resultFiles];

      // 按搜索文本筛选
      if (fileSearchText) {
        const searchLower = fileSearchText.toLowerCase();
        filteredFiles = filteredFiles.filter((file) =>
          file.toLowerCase().includes(searchLower)
        );
      }

      // 计算分页
      const totalFiles = filteredFiles.length;
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, totalFiles);
      const paginatedFiles = filteredFiles.slice(startIndex, endIndex);

      return (
        <div className={styles.analysisResultsContainer}>
          <h3>Analysis Results</h3>
          <div className={styles.resultsFilesSection}>
            <div className={styles.resultsFilesHeader}>
              <h4>Result Files List ({totalFiles})</h4>
              <div className={styles.resultsFilesTools}>
                <Input
                  placeholder="Search files"
                  prefix={<SearchOutlined />}
                  value={fileSearchText}
                  onChange={handleFileSearch}
                  className={styles.fileSearchInput}
                  allowClear
                />
              </div>
            </div>

            {paginatedFiles.length > 0 ? (
              <div className={styles.resultsFilesList}>
                {paginatedFiles.map((file, index) => (
                  <div
                    key={startIndex + index}
                    className={styles.resultFileItem}
                    onClick={() => handleFileClick(file)}
                  >
                    <div className={styles.fileIcon}>{getFileIcon()}</div>
                    <span className={styles.fileLink}>{file}</span>
                  </div>
                ))}
              </div>
            ) : (
              <Empty
                description="No matching files found"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                className={styles.noFilesFound}
              />
            )}

            {totalFiles > pageSize && (
              <div className={styles.resultsPagination}>
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={totalFiles}
                  onChange={handlePageChange}
                  showSizeChanger
                  pageSizeOptions={["12", "24", "48", "96"]}
                  showTotal={(total) => `Total ${total} files`}
                />
              </div>
            )}
          </div>

          {/* 下载完整结果包 */}
          {resultPackage && (
            <div className={styles.downloadPackageSection}>
              <h4>Complete Result Package</h4>
              <Button
                type="primary"
                icon={<FileZipOutlined />}
                onClick={() => {
                  if (taskId) {
                    // 直接下载文件
                    const apiBaseUrl =
                      import.meta.env.VITE_API_BASE_URL || "/api";
                    const downloadUrl = `${apiBaseUrl}/editAnalysis/task/${taskId}/file/${resultPackage}/`;
                    window.open(downloadUrl, "_blank");
                  }
                }}
                className={styles.downloadButton}
              >
                Download All Results ({resultPackage})
              </Button>
            </div>
          )}
        </div>
      );
    }
    return null;
  };
  const calculateMD5 = (file) => {
    return new Promise((resolve, reject) => {
      const chunkSize = 2 * 1024 * 1024; // 每个分片2MB
      const chunks = Math.ceil(file.size / chunkSize);
      let currentChunk = 0;
      const spark = new SparkMD5.ArrayBuffer();
      const fileReader = new FileReader();

      // 显示提示信息
      if (file.size > 1024 * 1024 * 1024) {
        // 如果文件大于1GB
        message.info(
          `Large file detected (${(file.size / (1024 * 1024 * 1024)).toFixed(
            2
          )} GB). MD5 calculation may take some time.`
        );
      }

      fileReader.onload = (e) => {
        try {
          spark.append(e.target.result);
          currentChunk++;

          // 更新上传进度状态以显示MD5计算进度
          const field = file.name.endsWith(".zip")
            ? "fq_files_md5"
            : "target_file_md5";
          const percentCompleted = Math.round((currentChunk / chunks) * 30); // MD5计算占总上传进度的30%
          setUploadProgress((prev) => ({ ...prev, [field]: percentCompleted }));

          if (currentChunk < chunks) {
            // 继续加载下一个分片
            loadNext();
          } else {
            // 所有分片处理完毕，计算最终的MD5值
            const md5 = spark.end();
            resolve(md5);
          }
        } catch (error) {
          reject(error);
        }
      };

      fileReader.onerror = (e) => {
        console.error("File read error during MD5 calculation:", e);
        reject(e);
      };

      function loadNext() {
        const start = currentChunk * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const blob = file.slice(start, end);

        // 添加延迟以避免浏览器过载
        setTimeout(() => {
          try {
            fileReader.readAsArrayBuffer(blob);
          } catch (error) {
            reject(error);
          }
        }, 10);
      }

      // 开始加载第一个分片
      loadNext();
    });
  };

  const handleFileChange = async (file, field) => {
    if (!file) {
      setFormData({ ...formData, [field]: null });
      setUploadProgress({ ...uploadProgress, [field]: 0 });
      setUploading({ ...uploading, [field]: false });
      return;
    }

    try {
      // 获取原始文件对象
      const originFile = file.originFileObj || file;

      // 设置上传状态
      setUploading({ ...uploading, [field]: true });
      setUploadProgress({ ...uploadProgress, [field]: 0 });

      const md5 = await calculateMD5(originFile);

      // 创建FormData对象用于上传
      const formDataUpload = new FormData();

      // 根据字段类型添加对应的MD5字段
      if (field === "fq_files_md5") {
        formDataUpload.append("fq_files", originFile);
        formDataUpload.append("fq_files_md5", md5);
      } else if (field === "target_file_md5") {
        formDataUpload.append("target_file", originFile);
        formDataUpload.append("target_file_md5", md5);
      }

      // 设置请求头为multipart/form-data
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      // 更新进度条显示为30%后开始上传（前30%是MD5计算）
      setUploadProgress((prev) => ({ ...prev, [field]: 30 }));

      // 调用文件上传API
      const response = await uploadFile(formDataUpload, {
        ...config,
        onUploadProgress: (progressEvent) => {
          // 上传进度从30%开始计算到100%
          const uploadPercent = Math.round(
            (progressEvent.loaded * 70) / progressEvent.total
          );
          const totalPercent = 30 + uploadPercent; // MD5计算占30%，实际上传占70%
          setUploadProgress((prev) => ({ ...prev, [field]: totalPercent }));
        },
      });

      // 更新表单数据
      const newFormData = { ...formData, [field]: md5 };
      setFormData(newFormData);

      // 完成上传
      setUploading({ ...uploading, [field]: false });
      setUploadProgress({ ...uploadProgress, [field]: 100 });

      message.success("File uploaded successfully");
    } catch (error) {
      // 上传失败
      setUploading({ ...uploading, [field]: false });
      setUploadProgress({ ...uploadProgress, [field]: 0 });

      message.error(`File processing failed: ${error.message}`);
      console.error("File processing error:", error);
    }
  };

  const handleNumberChange = (value, fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const validateZipFile = (file) => {
    const isZip = file.name.endsWith(".zip");
    if (!isZip) {
      message.error("You can only upload ZIP files!");
    }
    return isZip;
  };

  const validateTextFile = (file) => {
    const isText = file.name.endsWith(".txt") || file.name.endsWith(".text");
    if (!isText) {
      message.error("You can only upload TEXT files!");
    }
    return isText;
  };

  const file1UploadProps = {
    beforeUpload: (file) => {
      const isValid = validateZipFile(file);
      // 阻止自动上传
      return isValid ? false : Upload.LIST_IGNORE;
    },
    maxCount: 1,
    showUploadList: true,
    onChange: (info) => {
      if (info.file.status !== "removed") {
        handleFileChange(info.file, "fq_files_md5");
      } else {
        handleFileChange(null, "fq_files_md5");
      }
    },
  };

  const file2UploadProps = {
    beforeUpload: (file) => {
      const isValid = validateTextFile(file);
      // 阻止自动上传
      return isValid ? false : Upload.LIST_IGNORE;
    },
    maxCount: 1,
    showUploadList: true,
    onChange: (info) => {
      if (info.file.status !== "removed") {
        handleFileChange(info.file, "target_file_md5");
      } else {
        handleFileChange(null, "target_file_md5");
      }
    },
  };

  return (
    <div className={styles.editingAnalysisContainer}>
      {contextHolder}
      {/* 上部分：左图右文 */}
      <div className={styles.editingAnalysisHeader}>
        <div className={styles.editingAnalysisImage}>
          <img src={editingAnalysisImage} alt="Editing Analysis" />
        </div>
        <div className={styles.editingAnalysisIntro}>
          <h1>What is editing analysis?</h1>
          <p>
            When CRISPR plasmids is delivered to infected plants through
            agrobacterium tumefaciens to complete genetic transformation, we
            need to know whether the target gene in transgenic offspring is
            mutated and the type of mutation. There are generally two detection
            methods: 1) traditional Sanger sequencing, which is usually
            time-consuming and laborious. 2) Illumina high throughput
            sequencing.
            <InfoCircleOutlined
              onClick={() => {
                alert("info");
              }}
            />
          </p>
          <h2>How to do?</h2>
          <ol>
            <li>Primrt and Barcode design;</li>
            <li>PCR amplification and product mixing;</li>
            <li>Illumina sequence;</li>
            <li>Analysis and plot.</li>
          </ol>
        </div>
      </div>
      {/* 下部分：表单 */}
      <div style={{ textAlign: "center", margin: "40px 0 20px 0" }}>
        <button className={styles.sectionButton}>How to cite us?</button>
      </div>
      <div className={styles.editingAnalysisForm}>
        <Steps
          current={0}
          size="small"
          className="analysis-steps"
          style={{ margin: "0 auto 20px", maxWidth: "800px" }}
          items={[
            {
              title: "Upload Files",
              description: "Upload sequencing and target files",
              icon: <UploadOutlined />,
            },
            {
              title: "Set Parameters",
              description: "Set analysis range",
              icon: <NumberOutlined />,
            },
            {
              title: "Analysis Results",
              description: "View analysis results",
              icon: <CheckCircleOutlined />,
            },
          ]}
        />
        <form onSubmit={handleSubmit}>
          <div className={styles.editingFormRow}>
            <div className={styles.editingFormGroup}>
              <label htmlFor="file1">
                Sequencing fastq.zip:
                <Tooltip
                  title={
                    <div>
                      <p>
                        ZIP file containing folders with paired-end sequencing
                        data:
                      </p>
                      <ul style={{ paddingLeft: "15px", margin: "5px 0" }}>
                        <li>Each sample in its own folder</li>
                        <li>
                          Folder names must match SamID in target_data.txt
                        </li>
                        <li>Files should be in *_1.fq.gz/*_2.fq.gz format</li>
                      </ul>
                      <pre
                        style={{
                          backgroundColor: "#f5f5f5",
                          padding: "5px",
                          fontSize: "12px",
                          marginTop: "5px",
                          color: "black",
                          overflowX: "auto",
                        }}
                      >
                        {`data.zip
  sample1/
    sample1_1.fq.gz
    sample1_2.fq.gz
  sample2/
    sample2_1.fq.gz
    sample2_2.fq.gz`}
                      </pre>
                    </div>
                  }
                >
                  <QuestionCircleOutlined className="form-help-icon" />
                </Tooltip>
              </label>
              <Upload {...file1UploadProps}>
                <Button
                  icon={
                    uploading.fq_files_md5 ? (
                      <LoadingOutlined />
                    ) : (
                      <UploadOutlined />
                    )
                  }
                  disabled={uploading.fq_files_md5 || formData.fq_files_md5}
                >
                  {uploading.fq_files_md5 ? "Uploading" : "Click to Upload Zip"}
                </Button>
              </Upload>
              {uploading.fq_files_md5 && (
                <Progress
                  percent={uploadProgress.fq_files_md5 || 0}
                  size="small"
                  status="active"
                  style={{ marginTop: 8 }}
                />
              )}
            </div>

            <div className={styles.editingFormGroup}>
              <label htmlFor="file2">
                Target file:
                <Tooltip
                  title={
                    <div>
                      <p>Tab-delimited text file with 3 columns:</p>
                      <ul style={{ paddingLeft: "15px", margin: "5px 0" }}>
                        <li>
                          <strong>SamID</strong>: Sample name
                        </li>
                        <li>
                          <strong>amplicon_seq</strong>: Reference sequence
                        </li>
                        <li>
                          <strong>guide_seq</strong>: Target sequence (part of
                          reference sequence)
                        </li>
                      </ul>
                      <pre
                        style={{
                          backgroundColor: "#f5f5f5",
                          padding: "5px",
                          fontSize: "12px",
                          marginTop: "5px",
                          color: "black",
                          overflowX: "auto",
                        }}
                      >
                        {`SamID\tamplicon_seq\tguide_seq
sample1\tAAAAG...\tGAGACT...
sample2\tAAAAG...\tGAGACT...`}
                      </pre>
                    </div>
                  }
                >
                  <QuestionCircleOutlined className="form-help-icon" />
                </Tooltip>
              </label>
              <Upload {...file2UploadProps} disabled={uploading.fq_files_md5}>
                <Button
                  icon={
                    uploading.target_file_md5 ? (
                      <LoadingOutlined />
                    ) : (
                      <UploadOutlined />
                    )
                  }
                  disabled={uploading.fq_files_md5}
                >
                  {uploading.target_file_md5 ? "Uploading" : "Click to Upload"}
                </Button>
              </Upload>
              {uploading.target_file_md5 && (
                <Progress
                  percent={uploadProgress.target_file_md5 || 0}
                  size="small"
                  status="active"
                  style={{ marginTop: 8 }}
                />
              )}
            </div>
          </div>

          <div className={styles.editingFormRow}>
            <div className={styles.editingFormGroup}>
              <label htmlFor="start">Start:</label>
              <InputNumber
                id="start"
                value={formData.start}
                onChange={(value) => handleNumberChange(value, "start")}
              />
            </div>

            <div className={styles.editingFormGroup}>
              <label htmlFor="end">End:</label>
              <InputNumber
                id="end"
                value={formData.end}
                onChange={(value) => handleNumberChange(value, "end")}
              />
            </div>
          </div>

          <div className={styles.formSubmit}>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={
                loading || uploading.fq_files_md5 || uploading.target_file_md5
              }
            >
              {loading
                ? "Analyzing..."
                : uploading.fq_files_md5 || uploading.target_file_md5
                ? "Please wait for uploads to complete"
                : "Submit"}
            </button>
          </div>
        </form>
        {renderTaskStatus()} {/* 渲染任务状态 */}
        {(taskStatus === "success" || taskStatus === "partial_success") &&
          renderResults()}{" "}
        {/* 任务成功或部分成功时渲染结果 */}
      </div>
    </div>
  );
};

export default EditingAnalysis;
