import { post, get } from "@/utils/request";

// 任务分析
export const editedAnalysis = async (params) => {
  return post("/editAnalysis/analysis/", {
    fq_files_md5: params.fq_files_md5,
    target_file_md5: params.target_file_md5,
    start: params.start,
    end: params.end,
  });
};

// 文件上传
export const uploadFile = async (params, config = {}) => {
  return post("/editAnalysis/upload/", params, config);
};

// 任务查询
export const getTask = async (params) => {
  return get(`/editAnalysis/task/${params.task_id}/`);
};

// 结果查询
export const getResult = async (params) => {
  return get(`/editAnalysis/task/${params.task_id}/file/${params.fileName}/`);
};