import { post } from "@/utils/request";

/**
 * Base Editor设计API接口
 * @param {Object} params - 请求参数
 * @param {Function} onDownloadProgress - 可选的下载进度回调函数
 * @returns {Promise} API响应结果
 */
export const executeBEDesign = async (params, onDownloadProgress) => {
    return post("/baseEditor/execute/", {
        "inputSequence": params.inputSequence,
        "pam": params.pam,
        "spacerLength": params.spacerLength,
        "sgRNAModule": params.sgRNAModule,
        "name_db": params.name_db,
        "base_editing_window": params.BE_windows,
        "type": params.editType,
    }, {
        onDownloadProgress: onDownloadProgress,
    });
}