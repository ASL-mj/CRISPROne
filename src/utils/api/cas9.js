import { post } from "@/utils/request";

/**
 * Cas9设计API接口
 * @param {Object} params - 请求参数
 * @param {string} params.inputSequence - 输入序列
 * @param {string} params.pam - PAM类型
 * @param {string} params.spacerLength - Spacer长度
 * @param {string} params.sgRNAModule - sgRNA模块
 * @param {string} params.name_db - 数据库名称
 * @param {Function} onDownloadProgress - 可选的下载进度回调函数
 * @returns {Promise} API响应结果
 */
export const executeCas9Design = async (params, onDownloadProgress) => {
  return post("/cas9/execute/", {
    inputSequence: params.inputSequence,
    pam: params.pam,
    spacerLength: params.spacerLength,
    sgRNAModule: params.sgRNAModule,
    name_db: params.name_db,
  }, {
    onDownloadProgress: onDownloadProgress,
  });
};

/**
 * 数据转换函数 - 将前端表单数据转换为API接口格式
 * @param {Object} formData - 前端表单数据
 * @returns {Object} 转换后的API请求数据
 */
export const transformFormDataToApiParams = (formData) => {
  return {
    inputSequence: formData.inputSequences, // 注意字段名的转换
    pam: formData.pamType,
    spacerLength: formData.spacerLength.toString(), // 确保是字符串格式
    sgRNAModule: formData.sgrnaModule,
    name_db: formData.targetGenome,
    customizedPAM: formData.customizedPAM,
  };
};
