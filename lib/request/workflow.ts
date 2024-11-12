// 生成页面
import axios from "../workflow-axios";
import { errorCaptureRes, storage } from "@utils/index";
const userId = storage.get("user_id");
// B1 全维度保持80%(77s)
export const dressVariation20PCT = (params: object) => {
  return axios.post("/v1/dress_variation_20PCT", {
    userUUID: userId,
    batchSize: 1,
    ...params,
  });
};
// B2 版型变化(76s)
export const dressPatternVariation = (params: object) => {
  return axios.post("/v1/dress_pattern_variation", {
    userUUID: userId,
    batchSize: 1,
    ...params,
  });
};
// B7 全维度保持50%(70s)
export const dressVariation50PCT = (params: object) => {
  return axios.post("/v1/dress_variation_50PCT", {
    userUUID: userId,
    batchSize: 1,
    ...params,
  });
};

// 固定/随机版型印花上身(122s)
export const dressPrintingTryon = (params: object) => {
  return axios.post("/v1/dress_printing_tryon", {
    userUUID: userId,
    batchSize: 1,
    ...params,
  });
};

// 提示词生成印花
export const generatePrintingFromPrompt = (params: object) => {
  return axios.post("/v1/generate_printing_from_prompt", {
    userUUID: userId,
    batchSize: 3,
    ...params,
  });
};

// a and b
export const transferAAndB = (params: object) => {
  return axios.post("/v1/transfer_a_and_b", {
    userUUID: userId,
    batchSize: 3,
    ...params,
  });
};

// B3 印花变化(65s)
export const dressPrintingVariation = (params: object) => {
  return axios.post("/v1/dress_printing_variation", {
    userUUID: userId,
    batchSize: 1,
    ...params,
  });
};

// B6 颜色变化(43s)
export const garmentColorVariation = (params: object) => {
  return axios.post("/v1/garment_color_variation", {
    userUUID: userId,
    batchSize: 1,
    ...params,
  });
};

// 排列印花图案生成(69s)
export const generateTiledPrinting = (params: object) => {
  return axios.post("/v1/generate_tiled_printing", {
    userUUID: userId,
    batchSize: 1,
    ...params,
  });
};
// 图案元素生成(22s)
export const generatePrintingElement = (params: object) => {
  return axios.post("/v1/generate_printing_element", {
    userUUID: userId,
    batchSize: 1,
    ...params,
  });
};
// 文字logo印花元素生成(20s)
export const printingLogoVariation = (params: object) => {
  return axios.post("/v1/printing_logo_variation", {
    userUUID: userId,
    batchSize: 1,
    ...params,
  });
};
// 生成中途反馈测试
export const progressFeedbackTest = (params: object) => {
  return axios.post("/v1/progress_feedback_test", {
    userUUID: userId,
    batchSize: 1,
    ...params,
  });
};

// 面料+工艺
export const transferFabricAndWorkmanship = (params: object) => {
  return axios.post("/v1/transfer_fabric_and_workmanship", {
    userUUID: userId,
    batchSize: 1,
    ...params,
  });
};
// 结构+颜色
export const transferStructureAndColor = (params: object) => {
  return axios.post("/v1/transfer_structure_and_color", {
    userUUID: userId,
    batchSize: 1,
    ...params,
  });
};

// 通过taskid拿结果
export const getResult = (params: object) => {
  return axios.post("/v1/img2img/query", params);
};
