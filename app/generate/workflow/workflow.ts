import { Params } from "@definitions/update";

import {
  dressVariation20PCT,
  dressPatternVariation,
  dressVariation50PCT,
  dressPrintingTryon,
  generatePrintingFromPrompt,
  transferAAndB,
  getResult,
} from "@lib/request/generate"; // B1 全维度保持80%(77s)
export const workflow = async (p: Params) => {
  const {
    loadOriginalImage,
    loadPrintingImage,
    backgroundColor,
    text,
    loadFabricImage,
  } = p;
  const newFabricImage =
    loadFabricImage &&
    "http://aimoda-ai.oss-us-east-1.aliyuncs.com/3a982f03073f4c973cbb606541355c50.jpg";
  if (
    loadPrintingImage &&
    backgroundColor === "#fdfdfb" &&
    text?.trim() === "" &&
    !loadFabricImage
  ) {
    const results = await Promise.allSettled([
      dressPrintingTryon({ ...p, loadFabricImage: newFabricImage }),
      dressPrintingTryon({ ...p, loadFabricImage: newFabricImage }),
      dressPrintingTryon({ ...p, loadFabricImage: newFabricImage }),
      dressPrintingTryon({ ...p, loadFabricImage: newFabricImage }),
      dressPrintingTryon({ ...p, loadFabricImage: newFabricImage }),
      dressPrintingTryon({ ...p, loadFabricImage: newFabricImage }),
    ]);
    const successfulResults = results.filter(
      (result) => result.status === "fulfilled"
    );
    const failedResults = results.filter(
      (result) => result.status === "rejected"
    );

    const taskIDs = successfulResults.map((result) => result.value.data.taskID);
    console.log("Successful task IDs:", taskIDs);

    failedResults.forEach((result) => {
      console.error("Failure:", result.reason);
      if (result.reason.code === "ERR_NETWORK") {
        console.error("Network Error:", result.reason.message);
      }
    });

    return taskIDs;
  } else if (!loadPrintingImage && text?.trim() && !loadFabricImage) {
    console.log(3);
    const results = await Promise.allSettled([
      generatePrintingFromPrompt({ ...p, loadFabricImage: newFabricImage }),
      generatePrintingFromPrompt({ ...p, loadFabricImage: newFabricImage }),
    ]);
    const successfulResults = results.filter(
      (result) => result.status === "fulfilled"
    );
    const failedResults = results.filter(
      (result) => result.status === "rejected"
    );

    const taskIDs = successfulResults.map((result) => result.value.data.taskID);
    console.log("Successful task IDs:", taskIDs);

    failedResults.forEach((result) => {
      console.error("Failure:", result.reason);
      if (result.reason.code === "ERR_NETWORK") {
        console.error("Network Error:", result.reason.message);
      }
    });

    return taskIDs;
  } else if (loadPrintingImage && text?.trim() && !loadFabricImage) {
    console.log(4);
    const results = await Promise.allSettled([
      generatePrintingFromPrompt({ ...p, loadFabricImage: newFabricImage }),
      generatePrintingFromPrompt({ ...p, loadFabricImage: newFabricImage }),
    ]);
    const successfulResults = results.filter(
      (result) => result.status === "fulfilled"
    );
    const failedResults = results.filter(
      (result) => result.status === "rejected"
    );

    const taskIDs = successfulResults.map((result) => result.value.data.taskID);
    console.log("Successful task IDs:", taskIDs);

    failedResults.forEach((result) => {
      console.error("Failure:", result.reason);
      if (result.reason.code === "ERR_NETWORK") {
        console.error("Network Error:", result.reason.message);
      }
    });

    return taskIDs;
  } else if (loadPrintingImage && text?.trim() && loadFabricImage) {
    console.log(5);
  } else {
    const results = await Promise.allSettled([
      dressVariation20PCT({ ...p, loadFabricImage: newFabricImage }),
      dressPatternVariation({ ...p, loadFabricImage: newFabricImage }),
      dressVariation50PCT({ ...p, loadFabricImage: newFabricImage }),
      transferAAndB({ ...p, loadFabricImage: newFabricImage }),
    ]);
    const successfulResults = results.filter(
      (result) => result.status === "fulfilled"
    );
    const failedResults = results.filter(
      (result) => result.status === "rejected"
    );

    const taskIDs = successfulResults.map((result) => result.value.data.taskID);
    console.log("Successful task IDs:", taskIDs);

    failedResults.forEach((result) => {
      console.error("Failure:", result.reason);
      if (result.reason.code === "ERR_NETWORK") {
        console.error("Network Error:", result.reason.message);
      }
    });

    return taskIDs;
  }
};
