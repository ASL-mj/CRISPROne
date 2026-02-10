import { post } from "@/utils/request";

/**
 * Cas12设计API接口
 * @param {Object} params - 请求参数
 * @param {string} params.inputSequence - 输入序列
 * @param {string} params.pam - PAM类型
 * @param {string} params.spacerLength - Spacer长度
 * @param {string} params.sgRNAModule - sgRNA模块
 * @param {string} params.name_db - 数据库名称
 * @param {string} params.cas_type - Cas类型
 * @param {Function} onDownloadProgress - 可选的下载进度回调函数
 * @returns {Promise} API响应结果
 */
export const executeCas12Design = async (params, onDownloadProgress) => {
  if (!params.cas_type) {
    throw new Error("cas_type is required.");
  }
  let url = "";
  if (params.cas_type === "cas12a") {
    url = "/cas12/cas12a/execute/";
  } else if (params.cas_type === "cas12b") {
    url = "/cas12/cas12b/execute/";
  } else {
    throw new Error(`Unsupported cas_type: ${params.cas_type}`);
  }
  return post(url, {
    inputSequence: params.inputSequences,
    pam: params.pamType,
    spacerLength: params.spacerLength,
    sgRNAModule: params.sgRNAModule,
    name_db: params.targetGenome,
  }, {
    onDownloadProgress: onDownloadProgress,
  });
};

/**
 * 查看结果接口
 * @param {Object} params - 请求参数
 * @param {string} params.task_id - 任务ID
 * @param {string} params.file_type - 文件类型
 * @returns {Promise} API响应结果
 */
export const getResult = async (params) => {
  return get(`/cas12a/cas12a_Jbrowse_API/`, {
    task_id: params.task_id,
    file_type: params.file_type,
  });
};