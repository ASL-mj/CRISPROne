import { post } from "@/utils/request";

/**
 * IscB设计API接口
 * @param {Object} params - 请求参数
 * @param {string} params.inputSequence - 输入序列
 * @param {string} params.pam - PAM类型
 * @param {string} params.spacerLength - Spacer长度
 * @param {string} params.sgRNAModule - sgRNA模块
 * @param {string} params.name_db - 数据库名称
 * @param {Function} onDownloadProgress - 可选的下载进度回调函数
 * @returns {Promise} API响应结果
 */
export const executeIscBDesign = async (params, onDownloadProgress) => {
  return post("/iscB/execute/", {
    inputSequence: params.inputSequence,
    pam: params.pam,
    spacerLength: params.spacerLength,
    sgRNAModule: params.sgRNAModule,
    name_db: params.name_db,
  }, {
    onDownloadProgress: onDownloadProgress,
  });
};