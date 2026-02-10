import { post } from "@/utils/request";

/**
 * Knockin设计API接口
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
export const executeKnockinDesign = async (params, onDownloadProgress) => {
  return post(`/crisprKnockin/execute/`, {
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
 * CRISPRa设计API接口
 * @param {Object} params - 请求参数
 * @param {Function} onDownloadProgress - 可选的下载进度回调函数
 * @returns {Promise} API响应结果
 */
export const executeCRISPRaDesign = async (params, onDownloadProgress) => {
  return post(`/crisprA/execute/`, {
    inputSequence: params.inputSequences,
    pam: params.pamType,
    spacerLength: params.spacerLength,
    sgRNAModule: params.sgRNAModule,
    name_db: params.targetGenome,
    upstream_sequence_length: params.upstreamSequenceLength,
  }, {
    onDownloadProgress: onDownloadProgress,
  });
};

/**
 * CRISPREpigenome设计API接口
 * @param {Object} params - 请求参数
 * @param {Function} onDownloadProgress - 可选的下载进度回调函数
 * @returns {Promise} API响应结果
 */
export const executeCRISPREpigenomeDesign = async (params, onDownloadProgress) => {
  return post(`/crisprEpigenome/execute/`, {
    inputSequence: params.inputSequences,
    pam: params.pamType,
    spacerLength: params.spacerLength,
    sgRNAModule: params.sgRNAModule,
    name_db: params.targetGenome,
  }, {
    onDownloadProgress: onDownloadProgress,
  });
};