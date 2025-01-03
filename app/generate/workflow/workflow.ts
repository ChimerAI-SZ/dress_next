import { Params } from "@definitions/update"
import { v4 as uuidv4 } from "uuid"
import {
  dressVariation20PCT,
  dressPatternVariation,
  dressVariation50PCT,
  dressPrintingTryon,
  generatePrintingSparseArrange,
  TransferAAndBPlus,
  TransferAAndBVITG,
  TransferAAndBSTANDARD,
  searchImage,
  imageAndTextGpt
} from "@lib/request/workflow"
import { generateImage, generateImageByRemix, getImageDescription } from "@lib/request/ideogram" // B1 全维度保持80%(77s)
import { getQuery, fetchAddBatch } from "@lib/request/generate"
import { fetchHomePage } from "@lib/request/page"
import { errorCaptureRes } from "@utils/index"

// 方案1: 通过后端代理
async function urlToFile(url: string, filename: string): Promise<File> {
  try {
    // 如果是同域名下的图片，直接获取
    if (url.startsWith("/") || url.startsWith(window.location.origin)) {
      const response = await fetch(url)
      const blob = await response.blob()
      return new File([blob], filename, { type: blob.type })
    }

    // 对于跨域图片，使用代理
    const response = await fetch("/api/proxy-image?url=" + encodeURIComponent(url))
    const blob = await response.blob()
    return new File([blob], filename, { type: blob.type })
  } catch (error) {
    console.error("Error fetching image:", error)
    throw new Error("Failed to fetch image")
  }
}

// 更新描述结果的接口定义
interface Description {
  text: string
}

// 使用更精确的类型定义
type ImageDescriptionResult = Array<{
  data: {
    descriptions: Array<{
      text: string
    }>
  }
}>

// 更新返回结果的接口定义
interface GenerateImageResult {
  data: {
    data: Array<{
      url: string
      prompt: string
      resolution: string
      seed: number
      style_type: string
      is_image_safe: boolean
    }>
    created: string
  }
  message: string
  success: boolean
}

export const workflowId_1 = async (p: Params) => {
  const { loadOriginalImage } = p
  console.log("loadOriginalImage", loadOriginalImage)

  if (!loadOriginalImage) {
    throw new Error("Original image URL is required")
  }

  const file = await urlToFile(loadOriginalImage, "original.jpg")
  const formData = new FormData()
  formData.append("image_file", file)
  const result = (await getImageDescription(formData)) as unknown as ImageDescriptionResult
  console.log(result)

  const promptText = result?.[0]?.data?.descriptions?.[0]?.text || result?.[1]?.data?.descriptions?.[0]?.text || "-"

  // 创建6个并发请求
  const requests = Array(6)
    .fill(null)
    .map(async () => {
      const formData = new FormData()
      formData.append("image_file", file)
      formData.append("prompt", promptText)
      formData.append("model", "V_2_TURBO")
      formData.append("style_type", "AUTO")
      formData.append("magic_prompt_option", "AUTO")
      formData.append("aspect_ratio", "ASPECT_3_4")
      formData.append("image_weight", "70")
      return generateImageByRemix(formData) as unknown as GenerateImageResult
    })

  // 等待所有请求完成
  const results = await Promise.all(requests)

  // 收集所有生成的图片URL到一个数组
  const generatedImages = results.reduce((acc: string[], result) => {
    // Handle the [null, {...}] response format
    const responseData = Array.isArray(result) ? result[1] : result

    if (!responseData?.data?.data?.[0]?.url) {
      console.error("Invalid response format:", result)
      return acc
    }
    return [...acc, responseData.data.data[0].url]
  }, [])

  if (generatedImages.length === 0) {
    throw new Error("No images were successfully generated")
  }

  console.log("Generated image URLs:", generatedImages)
  return generatedImages
}

export const workflow2 = async (p: Params) => {
  const { loadOriginalImage, loadPrintingImage, backgroundColor, text, loadFabricImage } = p
  const newFabricImage =
    loadFabricImage === ""
      ? "http://aimoda-ai.oss-us-east-1.aliyuncs.com/3a982f03073f4c973cbb606541355c50.jpg"
      : loadFabricImage
  console.log(222)
  const [err, res] = await errorCaptureRes(fetchHomePage, {
    limit: 5,
    offset: Math.floor(Math.random() * 46),
    library: "show-new"
  })
  console.log(res.data)

  // 存储每次请求的参数
  const requestParams = [
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage, loadOriginalImage: res.data[0].image_url },
    { ...p, loadFabricImage: newFabricImage, loadOriginalImage: res.data[1].image_url },
    { ...p, loadFabricImage: newFabricImage, loadOriginalImage: res.data[2].image_url },
    { ...p, loadFabricImage: newFabricImage, loadOriginalImage: res.data[3].image_url },
    { ...p, loadFabricImage: newFabricImage, loadOriginalImage: res.data[4].image_url }
  ]

  // 执行所有请求
  const results = await Promise.allSettled(requestParams.map(params => dressPrintingTryon(params)))
  console.log("results", results)
  // 过滤出成功的结果
  const successfulResults = results.filter(result => result.status === "fulfilled")
  // 提取每个成功结果中的 taskID 和请求参数
  const taskDetails = successfulResults.map((result, index) => {
    const taskID = result?.value.data.taskID // 从成功的结果中提取 taskID

    // 获取对应的请求参数
    const params = requestParams[index]

    return {
      task_id: taskID,
      task_info: JSON.stringify(params) // 将请求参数对象转换为 JSON 字符串
    }
  })
  const job_id = uuidv4()
  // 构造新的请求体对象
  const newObj = {
    job_id: job_id,
    tasks: taskDetails
  }

  // 调用 fetchAddBatch 请求接口
  fetchAddBatch(newObj)
    .then(() => {
      // 这里可以根据需要处理请求成功后的回调
    })
    .catch(err => {
      // 处理请求失败的情况
      console.error("请求失败：", err)
    })
  const taskIDs = successfulResults.map(result => result.value.data.taskID)
  return taskIDs
}

export const workflow3 = async (p: Params) => {
  console.log(3)
  const { loadOriginalImage, loadPrintingImage, backgroundColor, text, loadFabricImage } = p
  const newFabricImage =
    loadFabricImage === ""
      ? "http://aimoda-ai.oss-us-east-1.aliyuncs.com/3a982f03073f4c973cbb606541355c50.jpg"
      : loadFabricImage
  const [err, res] = await errorCaptureRes(fetchHomePage, {
    limit: 5,
    offset: Math.floor(Math.random() * 45),
    library: "show-new"
  })

  console.log(res.data)
  const results = await Promise.allSettled([
    generatePrintingSparseArrange({
      loadReferenceImage: "http://aimoda-ai.oss-us-east-1.aliyuncs.com/20241115-103637.jpg",
      positivePrompt: text?.trim(),
      interval: 128,
      backgroundColor: backgroundColor,
      tileScale: 50
    }),
    generatePrintingSparseArrange({
      loadReferenceImage: "http://aimoda-ai.oss-us-east-1.aliyuncs.com/20241115-103637.jpg",
      positivePrompt: text?.trim(),
      interval: 128,
      backgroundColor: backgroundColor,
      tileScale: 50
    }),
    generatePrintingSparseArrange({
      loadReferenceImage: "http://aimoda-ai.oss-us-east-1.aliyuncs.com/20241115-103637.jpg",
      positivePrompt: text?.trim(),
      interval: 128,
      backgroundColor: backgroundColor,
      tileScale: 50
    }),
    generatePrintingSparseArrange({
      loadReferenceImage: "http://aimoda-ai.oss-us-east-1.aliyuncs.com/20241115-103637.jpg",
      positivePrompt: text?.trim(),
      interval: 128,
      backgroundColor: backgroundColor,
      tileScale: 50
    }),
    generatePrintingSparseArrange({
      loadReferenceImage: "http://aimoda-ai.oss-us-east-1.aliyuncs.com/20241115-103637.jpg",
      positivePrompt: text?.trim(),
      interval: 128,
      backgroundColor: backgroundColor,
      tileScale: 50
    }),
    generatePrintingSparseArrange({
      loadReferenceImage: "http://aimoda-ai.oss-us-east-1.aliyuncs.com/20241115-103637.jpg",
      positivePrompt: text?.trim(),
      interval: 128,
      backgroundColor: backgroundColor,
      tileScale: 50
    })
  ])
  const midImage: any[] = []
  const successfulResults = results.filter(result => result.status === "fulfilled")
  let midTaskIDs = successfulResults.map(result => result.value.data.taskID)
  return new Promise<string[]>((resolve, reject) => {
    const interval = setInterval(async () => {
      for (let index = 0; index < midTaskIDs.length; index++) {
        const taskID = midTaskIDs[index]
        try {
          const resultData: any = await getQuery({ taskID })
          const { result, success, message } = resultData || {}
          if (success) {
            console.log(`Task ${taskID} completed`)
            midTaskIDs = midTaskIDs.filter(id => id !== taskID)
            midImage.push(result.res)
          } else {
            console.log(`Task ${taskID} still in progress`)
          }
          if (message !== "Task is running") {
            midTaskIDs = midTaskIDs.filter(id => id !== taskID)
          }
        } catch (error) {
          console.error(`Error fetching result for task ${taskID}:`, error)
        }
      }

      if (midTaskIDs.length === 0) {
        clearInterval(interval)

        const requestParams = [
          {
            ...p,
            loadPrintingImage: midImage[0],
            loadFabricImage: newFabricImage
          },
          {
            ...p,
            loadPrintingImage: midImage[1],
            loadOriginalImage: res.data[0].image_url,
            loadFabricImage: newFabricImage
          },
          {
            ...p,
            loadPrintingImage: midImage[2],
            loadOriginalImage: res.data[1].image_url,
            loadFabricImage: newFabricImage
          },
          {
            ...p,
            loadPrintingImage: midImage[3],
            loadOriginalImage: res.data[2].image_url,
            loadFabricImage: newFabricImage
          },
          {
            ...p,
            loadPrintingImage: midImage[4],
            loadOriginalImage: res.data[3].image_url,
            loadFabricImage: newFabricImage
          },
          {
            ...p,
            loadPrintingImage: midImage[5],
            loadOriginalImage: res.data[4].image_url,
            loadFabricImage: newFabricImage
          }
        ]

        // 执行所有请求
        const results = await Promise.allSettled(requestParams.map(params => dressPrintingTryon(params)))

        // 过滤出成功的结果
        const successfulResults = results.filter(result => result.status === "fulfilled")

        // 提取每个成功结果中的 taskID 和请求参数
        const taskDetails = successfulResults.map((result, index) => {
          const taskID = result.value.data.taskID // 从成功的结果中提取 taskID

          // 获取对应的请求参数
          const params = requestParams[index]

          return {
            task_id: taskID,
            task_info: JSON.stringify(params) // 将请求参数对象转换为 JSON 字符串
          }
        })
        const job_id = uuidv4()
        // 构造新的请求体对象
        const newObj = {
          job_id: job_id,
          tasks: taskDetails
        }

        // 调用 fetchAddBatch 请求接口
        fetchAddBatch(newObj)
          .then(() => {
            // 这里可以根据需要处理请求成功后的回调
          })
          .catch(err => {
            // 处理请求失败的情况
            console.error("请求失败：", err)
          })
        const taskIDs = successfulResults.map(result => result.value.data.taskID)
        resolve(taskIDs)

        // const results = await Promise.allSettled([
        //   dressPrintingTryon({
        //     ...p,
        //     loadPrintingImage: midImage[0],
        //     loadFabricImage: newFabricImage
        //   }),
        //   dressPrintingTryon({
        //     ...p,
        //     loadPrintingImage: midImage[1],
        //     loadOriginalImage: res.data[0].image_url,
        //     loadFabricImage: newFabricImage
        //   }),
        //   dressPrintingTryon({
        //     ...p,
        //     loadPrintingImage: midImage[2],
        //     loadOriginalImage: res.data[1].image_url,
        //     loadFabricImage: newFabricImage
        //   }),
        //   dressPrintingTryon({
        //     ...p,
        //     loadPrintingImage: midImage[3],
        //     loadOriginalImage: res.data[2].image_url,
        //     loadFabricImage: newFabricImage
        //   }),
        //   dressPrintingTryon({
        //     ...p,
        //     loadPrintingImage: midImage[4],
        //     loadOriginalImage: res.data[3].image_url,
        //     loadFabricImage: newFabricImage
        //   }),
        //   dressPrintingTryon({
        //     ...p,
        //     loadPrintingImage: midImage[5],
        //     loadOriginalImage: res.data[4].image_url,
        //     loadFabricImage: newFabricImage
        //   })
        // ])
        // const successfulResults = results.filter(result => result.status === "fulfilled")
        // const failedResults = results.filter(result => result.status === "rejected")

        // const taskIDs = successfulResults.map(result => result.value.data.taskID)
        // console.log("Successful task IDs:", taskIDs)

        // failedResults.forEach(result => {
        //   console.error("Failure:", result.reason)
        //   if (result.reason.code === "ERR_NETWORK") {
        //     console.error("Network Error:", result.reason.message)
        //   }
        // })

        // resolve(taskIDs)
      }
    }, 15000)
  })
}

export const workflow4 = async (p: Params) => {
  const { loadOriginalImage, loadPrintingImage, backgroundColor, text, loadFabricImage } = p
  const newFabricImage =
    loadFabricImage === ""
      ? "http://aimoda-ai.oss-us-east-1.aliyuncs.com/3a982f03073f4c973cbb606541355c50.jpg"
      : loadFabricImage
  console.log(4)
  const [err, res] = await errorCaptureRes(fetchHomePage, {
    limit: 4,
    offset: Math.floor(Math.random() * 45),
    library: "show-new"
  })
  console.log(res.data)
  const results = await Promise.allSettled([
    generatePrintingSparseArrange({
      loadReferenceImage: loadPrintingImage,
      positivePrompt: text?.trim(),
      interval: 128,
      backgroundColor: backgroundColor,
      tileScale: 50
    }),
    generatePrintingSparseArrange({
      loadReferenceImage: loadPrintingImage,
      positivePrompt: text?.trim(),
      interval: 128,
      backgroundColor: backgroundColor,
      tileScale: 50
    }),
    generatePrintingSparseArrange({
      loadReferenceImage: loadPrintingImage,
      positivePrompt: text?.trim(),
      interval: 128,
      backgroundColor: backgroundColor,
      tileScale: 50
    })
  ])
  const midImage: any[] = []
  const successfulResults = results.filter(result => result.status === "fulfilled")
  let midTaskIDs = successfulResults.map(result => result.value.data.taskID)
  return new Promise<string[]>((resolve, reject) => {
    const interval = setInterval(async () => {
      for (let index = 0; index < midTaskIDs.length; index++) {
        const taskID = midTaskIDs[index]
        try {
          const resultData: any = await getQuery({ taskID })
          const { result, success, message } = resultData || {}
          if (success) {
            console.log(`Task ${taskID} completed`)
            midTaskIDs = midTaskIDs.filter(id => id !== taskID)
            midImage.push(result.res)
          } else {
            console.log(`Task ${taskID} still in progress`)
          }
          if (message !== "Task is running") {
            midTaskIDs = midTaskIDs.filter(id => id !== taskID)
          }
        } catch (error) {
          console.error(`Error fetching result for task ${taskID}:`, error)
        }
      }

      if (midTaskIDs.length === 0) {
        clearInterval(interval)
        // const results = await Promise.allSettled([
        //   dressPrintingTryon({ ...p, loadFabricImage: newFabricImage }),
        //   dressPrintingTryon({
        //     ...p,
        //     loadOriginalImage: res.data[0].image_url,
        //     loadFabricImage: newFabricImage
        //   }),
        //   dressPrintingTryon({
        //     ...p,
        //     loadOriginalImage: res.data[1].image_url,
        //     loadFabricImage: newFabricImage
        //   }),
        //   dressPrintingTryon({ ...p, loadPrintingImage: midImage[0], loadFabricImage: newFabricImage }),
        //   dressPrintingTryon({
        //     ...p,
        //     loadPrintingImage: midImage[1],
        //     loadOriginalImage: res.data[2].image_url,
        //     loadFabricImage: newFabricImage
        //   }),
        //   dressPrintingTryon({
        //     ...p,
        //     loadPrintingImage: midImage[2],
        //     loadOriginalImage: res.data[3].image_url,
        //     loadFabricImage: newFabricImage
        //   })
        // ])

        const requestParams = [
          { ...p, loadFabricImage: newFabricImage },
          {
            ...p,
            loadOriginalImage: res.data[0].image_url,
            loadFabricImage: newFabricImage
          },
          {
            ...p,
            loadOriginalImage: res.data[1].image_url,
            loadFabricImage: newFabricImage
          },
          { ...p, loadPrintingImage: midImage[0], loadFabricImage: newFabricImage },
          {
            ...p,
            loadPrintingImage: midImage[1],
            loadOriginalImage: res.data[2].image_url,
            loadFabricImage: newFabricImage
          },
          {
            ...p,
            loadPrintingImage: midImage[2],
            loadOriginalImage: res.data[3].image_url,
            loadFabricImage: newFabricImage
          }
        ]

        // 执行所有请求
        const results = await Promise.allSettled(requestParams.map(params => dressPrintingTryon(params)))

        // 过滤出成功的结果
        const successfulResults = results.filter(result => result.status === "fulfilled")

        // 提取每个成功结果中的 taskID 和请求参数
        const taskDetails = successfulResults.map((result, index) => {
          const taskID = result.value.data.taskID // 从成功的结果中提取 taskID

          // 获取对应的请求参数
          const params = requestParams[index]

          return {
            task_id: taskID,
            task_info: JSON.stringify(params) // 将请求参数对象转换为 JSON 字符串
          }
        })
        const job_id = uuidv4()
        // 构造新的请求体对象
        const newObj = {
          job_id: job_id,
          tasks: taskDetails
        }

        // 调用 fetchAddBatch 请求接口
        fetchAddBatch(newObj)
          .then(() => {
            // 这里可以根据需要处理请求成功后的回调
          })
          .catch(err => {
            // 处理请求失败的情况
            console.error("请求失败：", err)
          })
        const taskIDs = successfulResults.map(result => result.value.data.taskID)
        resolve(taskIDs)

        // const successfulResults = results.filter(result => result.status === "fulfilled")
        // const failedResults = results.filter(result => result.status === "rejected")

        // const taskIDs = successfulResults.map(result => result.value.data.taskID)
        // console.log("Successful task IDs:", taskIDs)

        // failedResults.forEach(result => {
        //   console.error("Failure:", result.reason)
        //   if (result.reason.code === "ERR_NETWORK") {
        //     console.error("Network Error:", result.reason.message)
        //   }
        // })

        // resolve(taskIDs)
      }
    }, 15000)
  })
}

export const workflow5 = async (p: Params) => {
  const { loadOriginalImage, loadPrintingImage, backgroundColor, text, loadFabricImage } = p
  const newFabricImage =
    loadFabricImage === ""
      ? "http://aimoda-ai.oss-us-east-1.aliyuncs.com/3a982f03073f4c973cbb606541355c50.jpg"
      : loadFabricImage
  console.log(555)
  const [err, res] = await errorCaptureRes(fetchHomePage, {
    limit: 4,
    offset: Math.floor(Math.random() * 45),
    library: "show-new"
  })
  console.log(5555555)
  console.log(res.data)
  const results = await Promise.allSettled([
    generatePrintingSparseArrange({
      loadReferenceImage: loadPrintingImage,
      positivePrompt: text?.trim(),
      interval: 128,
      backgroundColor: backgroundColor,
      tileScale: 50
    }),
    generatePrintingSparseArrange({
      loadReferenceImage: loadPrintingImage,
      positivePrompt: text?.trim(),
      interval: 128,
      backgroundColor: backgroundColor,
      tileScale: 50
    }),
    generatePrintingSparseArrange({
      loadReferenceImage: loadPrintingImage,
      positivePrompt: text?.trim(),
      interval: 128,
      backgroundColor: backgroundColor,
      tileScale: 50
    })
  ])
  console.log(555)
  const midImage: any[] = []
  const successfulResults = results.filter(result => result.status === "fulfilled")
  let midTaskIDs = successfulResults.map(result => result.value.data.taskID)
  return new Promise<string[]>((resolve, reject) => {
    const interval = setInterval(async () => {
      for (let index = 0; index < midTaskIDs.length; index++) {
        const taskID = midTaskIDs[index]
        try {
          const resultData: any = await getQuery({ taskID })
          const { result, success, message } = resultData || {}
          if (success) {
            console.log(`Task ${taskID} completed`)
            midTaskIDs = midTaskIDs.filter(id => id !== taskID)
            midImage.push(result.res)
          } else {
            console.log(`Task ${taskID} still in progress`)
          }
          if (message !== "Task is running") {
            midTaskIDs = midTaskIDs.filter(id => id !== taskID)
          }
        } catch (error) {
          console.error(`Error fetching result for task ${taskID}:`, error)
        }
      }

      if (midTaskIDs.length === 0) {
        clearInterval(interval)

        // const results = await Promise.allSettled([
        //   dressPrintingTryon(p),
        //   dressPrintingTryon({
        //     ...p,
        //     loadOriginalImage: res.data[0].image_url
        //   }),
        //   dressPrintingTryon({
        //     ...p,
        //     loadOriginalImage: res.data[1].image_url
        //   }),
        //   dressPrintingTryon({ ...p, loadPrintingImage: midImage[0] }),
        //   dressPrintingTryon({
        //     ...p,
        //     loadPrintingImage: midImage[1],
        //     loadOriginalImage: res.data[2].image_url
        //   }),
        //   dressPrintingTryon({
        //     ...p,
        //     loadPrintingImage: midImage[2],
        //     loadOriginalImage: res.data[3].image_url
        //   })
        // ])

        const requestParams = [
          p,
          {
            ...p,
            loadOriginalImage: res.data[0].image_url
          },
          {
            ...p,
            loadOriginalImage: res.data[1].image_url,
            loadFabricImage: newFabricImage
          },
          { ...p, loadPrintingImage: midImage[0] },
          {
            ...p,
            loadPrintingImage: midImage[1],
            loadOriginalImage: res.data[2].image_url
          },
          {
            ...p,
            loadPrintingImage: midImage[2],
            loadOriginalImage: res.data[3].image_url
          }
        ]

        // 执行所有请求
        const results = await Promise.allSettled(requestParams.map(params => dressPrintingTryon(params)))

        // 过滤出成功的结果
        const successfulResults = results.filter(result => result.status === "fulfilled")

        // 提取每个成功结果中的 taskID 和请求参数
        const taskDetails = successfulResults.map((result, index) => {
          const taskID = result.value.data.taskID // 从成功的结果中提取 taskID

          // 获取对应的请求参数
          const params = requestParams[index]

          return {
            task_id: taskID,
            task_info: JSON.stringify(params) // 将请求参数对象转换为 JSON 字符串
          }
        })
        const job_id = uuidv4()
        // 构造新的请求体对象
        const newObj = {
          job_id: job_id,
          tasks: taskDetails
        }

        // 调用 fetchAddBatch 请求接口
        fetchAddBatch(newObj)
          .then(() => {
            // 这里可以根据需要处理请求成功后的回调
          })
          .catch(err => {
            // 处理请求失败的情况
            console.error("请求失败：", err)
          })
        const taskIDs = successfulResults.map(result => result.value.data.taskID)
        resolve(taskIDs)

        // const successfulResults = results.filter(result => result.status === "fulfilled")
        // const failedResults = results.filter(result => result.status === "rejected")

        // const taskIDs = successfulResults.map(result => result.value.data.taskID)
        // console.log("Successful task IDs:", taskIDs)

        // failedResults.forEach(result => {
        //   console.error("Failure:", result.reason)
        //   if (result.reason.code === "ERR_NETWORK") {
        //     console.error("Network Error:", result.reason.message)
        //   }
        // })

        // resolve(taskIDs)
      }
    }, 15000)
  })
}

export const workflow1_6 = async (p: Params) => {}

export const workflow11 = async (p: Params) => {
  const { loadOriginalImage, loadPrintingImage, backgroundColor, text, loadFabricImage } = p
  const newFabricImage =
    loadFabricImage === ""
      ? "http://aimoda-ai.oss-us-east-1.aliyuncs.com/3a982f03073f4c973cbb606541355c50.jpg"
      : loadFabricImage

  // 尝试调用 searchImage
  let shouldRunAllApis = false
  let similarImageUrl = ""

  try {
    const ImageResult = await errorCaptureRes(searchImage, loadOriginalImage || "")
    if (ImageResult[1]?.data?.similar_image_url) {
      similarImageUrl = ImageResult[1].data.similar_image_url
      shouldRunAllApis = true
    }
  } catch (error) {
    console.error("searchImage failed, will only run first 3 APIs:", error)
  }

  // 根据 searchImage 的结果决定调用哪些接口
  const apiCalls = [
    dressPatternVariation({ ...p, loadFabricImage: newFabricImage }),
    dressVariation50PCT({ ...p, loadFabricImage: newFabricImage }),
    dressVariation50PCT({ ...p, loadFabricImage: newFabricImage }),
    dressVariation50PCT({ ...p, loadFabricImage: newFabricImage }),
    dressVariation50PCT({ ...p, loadFabricImage: newFabricImage })
  ]

  // 如果 searchImage 成功，添加额外的 3 个接口调用
  // 如果 searchImage 成功，添加额外的 3 个接口调用
  if (shouldRunAllApis) {
    const transferParams = {
      loadAImage: loadOriginalImage,
      loadBImage: similarImageUrl,
      transferWeight: 0.2
    }

    // 定义可用的 Transfer API 数组
    const transferApis = [TransferAAndBPlus, TransferAAndBVITG, TransferAAndBSTANDARD]

    // 随机选择一个 Transfer API
    const randomIndex = Math.floor(Math.random() * transferApis.length)
    const selectedTransferApi = transferApis[randomIndex]

    // 只添加随机选择的一个 API
    apiCalls.push(selectedTransferApi(transferParams))
  }

  const results = await Promise.allSettled(apiCalls)

  // 构建对应的请求参数数组
  const requestParams = [
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage }
  ]

  if (shouldRunAllApis) {
    const transferParamsForRequest = {
      loadOriginalImage: loadOriginalImage,
      loadFabricImage: similarImageUrl,
      backgroundColor,
      text,
      loadPrintingImage
    }

    requestParams.push(transferParamsForRequest)
  }

  // 过滤出成功的结果
  const successfulResults = results.filter(result => result.status === "fulfilled")

  // 提取每个成功结果中的 taskID 和请求参数
  const taskDetails = successfulResults.map((result, index) => {
    const taskID = result.value.data.taskID
    const params = requestParams[index]

    return {
      task_id: taskID,
      task_info: JSON.stringify(params)
    }
  })

  const job_id = uuidv4()
  const newObj = {
    job_id: job_id,
    tasks: taskDetails
  }

  // 调用 fetchAddBatch 请求接口
  fetchAddBatch(newObj)
    .then(() => {
      // 这里可以根据需要处理请求成功后的回调
    })
    .catch(err => {
      console.error("请求失败：", err)
    })

  const taskIDs = successfulResults.map(result => result.value.data.taskID)
  return taskIDs
}
export const workflow111 = async (p: Params) => {
  const { loadOriginalImage, loadPrintingImage, backgroundColor, text, loadFabricImage } = p
  const newFabricImage =
    loadFabricImage === ""
      ? "http://aimoda-ai.oss-us-east-1.aliyuncs.com/3a982f03073f4c973cbb606541355c50.jpg"
      : loadFabricImage

  // 尝试调用 searchImage
  let shouldRunAllApis = false
  let similarImageUrl = ""

  try {
    const ImageResult = await errorCaptureRes(searchImage, loadOriginalImage || "")
    if (ImageResult[1]?.data?.similar_image_url) {
      similarImageUrl = ImageResult[1].data.similar_image_url
      shouldRunAllApis = true
    }
  } catch (error) {
    console.error("searchImage failed, will only run first 3 APIs:", error)
  }

  // 根据 searchImage 的结果决定调用哪些接口
  const apiCalls = [
    dressVariation50PCT({ ...p, loadFabricImage: newFabricImage }),
    dressVariation50PCT({ ...p, loadFabricImage: newFabricImage }),
    dressVariation50PCT({ ...p, loadFabricImage: newFabricImage }),
    dressVariation50PCT({ ...p, loadFabricImage: newFabricImage }),
    dressVariation50PCT({ ...p, loadFabricImage: newFabricImage }),
    dressVariation50PCT({ ...p, loadFabricImage: newFabricImage })
  ]

  const results = await Promise.allSettled(apiCalls)

  // 构建对应的请求参数数组
  const requestParams = [
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage }
  ]

  if (shouldRunAllApis) {
    const transferParamsForRequest = {
      loadOriginalImage: loadOriginalImage,
      loadFabricImage: similarImageUrl,
      backgroundColor,
      text,
      loadPrintingImage
    }

    requestParams.push(transferParamsForRequest)
  }

  // 过滤出成功的结果
  const successfulResults = results.filter(result => result.status === "fulfilled")

  // 提取每个成功结果中的 taskID 和请求参数
  const taskDetails = successfulResults.map((result, index) => {
    const taskID = result.value.data.taskID
    const params = requestParams[index]

    return {
      task_id: taskID,
      task_info: JSON.stringify(params)
    }
  })

  const job_id = uuidv4()
  const newObj = {
    job_id: job_id,
    tasks: taskDetails
  }

  // 调用 fetchAddBatch 请求接口
  fetchAddBatch(newObj)
    .then(() => {
      // 这里可以根据需要处理请求成功后的回调
    })
    .catch(err => {
      console.error("请求失败：", err)
    })

  const taskIDs = successfulResults.map(result => result.value.data.taskID)
  return taskIDs
}

export const workflow21 = async (p: Params) => {
  const { loadOriginalImage, loadPrintingImage, backgroundColor, text, loadFabricImage } = p
  const newFabricImage =
    loadFabricImage === ""
      ? "http://aimoda-ai.oss-us-east-1.aliyuncs.com/3a982f03073f4c973cbb606541355c50.jpg"
      : loadFabricImage

  // 尝试调用 searchImage
  let shouldRunAllApis = false
  let similarImageUrl = ""

  try {
    const ImageResult = await errorCaptureRes(searchImage, loadOriginalImage || "")
    if (ImageResult[1]?.data?.similar_image_url) {
      similarImageUrl = ImageResult[1].data.similar_image_url
      shouldRunAllApis = true
    }
  } catch (error) {
    console.error("searchImage failed, will only run first 3 APIs:", error)
  }

  // 根据 searchImage 的结果决定调用哪些接口
  const apiCalls = [
    dressVariation20PCT({ ...p, loadFabricImage: newFabricImage }),
    dressPatternVariation({ ...p, loadFabricImage: newFabricImage }),
    dressPatternVariation({ ...p, loadFabricImage: newFabricImage }),
    dressPatternVariation({ ...p, loadFabricImage: newFabricImage }),
    dressPatternVariation({ ...p, loadFabricImage: newFabricImage })
  ]

  // 如果 searchImage 成功，添加额外的 3 个接口调用
  if (shouldRunAllApis) {
    const transferParams = {
      loadAImage: loadOriginalImage,
      loadBImage: similarImageUrl,
      transferWeight: 0.2
    }

    // 定义可用的 Transfer API 数组
    const transferApis = [TransferAAndBPlus, TransferAAndBVITG, TransferAAndBSTANDARD]

    // 随机选择一个 Transfer API
    const randomIndex = Math.floor(Math.random() * transferApis.length)
    const selectedTransferApi = transferApis[randomIndex]

    // 只添加随机选择的一个 API
    apiCalls.push(selectedTransferApi(transferParams))
  }

  const results = await Promise.allSettled(apiCalls)

  // 构建对应的请求参数数组
  const requestParams = [
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage }
  ]

  // 如果执行了额外的 Transfer API，添加对应参数
  if (shouldRunAllApis) {
    const transferParamsForRequest = {
      loadOriginalImage: loadOriginalImage,
      loadFabricImage: similarImageUrl,
      backgroundColor,
      text,
      loadPrintingImage
    }

    // 只添加一个参数对象，对应随机选择的 API
    requestParams.push(transferParamsForRequest)
  }

  // 过滤出成功的结果
  const successfulResults = results.filter(result => result.status === "fulfilled")

  // 提取每个成功结果中的 taskID 和请求参数
  const taskDetails = successfulResults.map((result, index) => {
    const taskID = result.value.data.taskID
    const params = requestParams[index]

    return {
      task_id: taskID,
      task_info: JSON.stringify(params)
    }
  })

  const job_id = uuidv4()
  const newObj = {
    job_id: job_id,
    tasks: taskDetails
  }

  // 调用 fetchAddBatch 请求接口
  fetchAddBatch(newObj)
    .then(() => {
      // 这里可以根据需要处理请求成功后的回调
    })
    .catch(err => {
      console.error("请求失败：", err)
    })

  const taskIDs = successfulResults.map(result => result.value.data.taskID)
  return taskIDs
}
export const workflow222 = async (p: Params) => {
  const { loadOriginalImage, loadPrintingImage, backgroundColor, text, loadFabricImage } = p
  const newFabricImage =
    loadFabricImage === ""
      ? "http://aimoda-ai.oss-us-east-1.aliyuncs.com/3a982f03073f4c973cbb606541355c50.jpg"
      : loadFabricImage

  // 尝试调用 searchImage
  let shouldRunAllApis = false
  let similarImageUrl = ""

  try {
    const ImageResult = await errorCaptureRes(searchImage, loadOriginalImage || "")
    if (ImageResult[1]?.data?.similar_image_url) {
      similarImageUrl = ImageResult[1].data.similar_image_url
      shouldRunAllApis = true
    }
  } catch (error) {
    console.error("searchImage failed, will only run first 3 APIs:", error)
  }

  // 根据 searchImage 的结果决定调用哪些接口
  const apiCalls = [
    dressPatternVariation({ ...p, loadFabricImage: newFabricImage }),
    dressPatternVariation({ ...p, loadFabricImage: newFabricImage }),
    dressPatternVariation({ ...p, loadFabricImage: newFabricImage }),
    dressPatternVariation({ ...p, loadFabricImage: newFabricImage }),
    dressPatternVariation({ ...p, loadFabricImage: newFabricImage }),
    dressPatternVariation({ ...p, loadFabricImage: newFabricImage })
  ]

  const results = await Promise.allSettled(apiCalls)

  // 构建对应的请求参数数组
  const requestParams = [
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage }
  ]

  if (shouldRunAllApis) {
    const transferParamsForRequest = {
      loadOriginalImage: loadOriginalImage,
      loadFabricImage: similarImageUrl,
      backgroundColor,
      text,
      loadPrintingImage
    }

    requestParams.push(transferParamsForRequest)
  }

  // 过滤出成功的结果
  const successfulResults = results.filter(result => result.status === "fulfilled")

  // 提取每个成功结果中的 taskID 和请求参数
  const taskDetails = successfulResults.map((result, index) => {
    const taskID = result.value.data.taskID
    const params = requestParams[index]

    return {
      task_id: taskID,
      task_info: JSON.stringify(params)
    }
  })

  const job_id = uuidv4()
  const newObj = {
    job_id: job_id,
    tasks: taskDetails
  }

  // 调用 fetchAddBatch 请求接口
  fetchAddBatch(newObj)
    .then(() => {
      // 这里可以根据需要处理请求成功后的回调
    })
    .catch(err => {
      console.error("请求失败：", err)
    })

  const taskIDs = successfulResults.map(result => result.value.data.taskID)
  return taskIDs
}

export const workflow31 = async (p: Params) => {
  const { loadOriginalImage, loadPrintingImage, backgroundColor, text, loadFabricImage } = p
  const newFabricImage =
    loadFabricImage === ""
      ? "http://aimoda-ai.oss-us-east-1.aliyuncs.com/3a982f03073f4c973cbb606541355c50.jpg"
      : loadFabricImage

  // 尝试调用 searchImage
  let shouldRunAllApis = false
  let similarImageUrl = ""

  try {
    const ImageResult = await errorCaptureRes(searchImage, loadOriginalImage || "")
    if (ImageResult[1]?.data?.similar_image_url) {
      similarImageUrl = ImageResult[1].data.similar_image_url
      shouldRunAllApis = true
    }
  } catch (error) {
    console.error("searchImage failed, will only run first 3 APIs:", error)
  }

  // 根据 searchImage 的结果决定调用哪些接口
  const apiCalls = [
    dressVariation20PCT({ ...p, loadFabricImage: newFabricImage }),
    dressVariation20PCT({ ...p, loadFabricImage: newFabricImage }),
    dressVariation20PCT({ ...p, loadFabricImage: newFabricImage }),
    dressVariation20PCT({ ...p, loadFabricImage: newFabricImage }),
    dressPatternVariation({ ...p, loadFabricImage: newFabricImage })
  ]

  // 如果 searchImage 成功，添加额外的 3 个接口调用
  if (shouldRunAllApis) {
    const transferParams = {
      loadAImage: loadOriginalImage,
      loadBImage: similarImageUrl,
      transferWeight: 0.2
    }

    // 定义可用的 Transfer API 数组
    const transferApis = [TransferAAndBPlus, TransferAAndBVITG, TransferAAndBSTANDARD]

    // 随机选择一个 Transfer API
    const randomIndex = Math.floor(Math.random() * transferApis.length)
    const selectedTransferApi = transferApis[randomIndex]

    // 只添加随机选择的一个 API
    apiCalls.push(selectedTransferApi(transferParams))
  }

  const results = await Promise.allSettled(apiCalls)

  // 构建对应的请求参数数组
  const requestParams = [
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage }
  ]

  // 如果执行了额外的 Transfer API，添加对应参数
  if (shouldRunAllApis) {
    const transferParamsForRequest = {
      loadOriginalImage: loadOriginalImage,
      loadFabricImage: similarImageUrl,
      backgroundColor,
      text,
      loadPrintingImage
    }

    // 只添加一个参数对象，对应随机选择的 API
    requestParams.push(transferParamsForRequest)
  }

  // 过滤出成功的结果
  const successfulResults = results.filter(result => result.status === "fulfilled")

  // 提取每个成功结果中的 taskID 和请求参数
  const taskDetails = successfulResults.map((result, index) => {
    const taskID = result.value.data.taskID
    const params = requestParams[index]

    return {
      task_id: taskID,
      task_info: JSON.stringify(params)
    }
  })

  const job_id = uuidv4()
  const newObj = {
    job_id: job_id,
    tasks: taskDetails
  }

  // 调用 fetchAddBatch 请求接口
  fetchAddBatch(newObj)
    .then(() => {
      // 这里可以根据需要处理请求成功后的回调
    })
    .catch(err => {
      console.error("请求失败：", err)
    })

  const taskIDs = successfulResults.map(result => result.value.data.taskID)
  return taskIDs
}
export const workflow333 = async (p: Params) => {
  const { loadOriginalImage, loadPrintingImage, backgroundColor, text, loadFabricImage } = p
  const newFabricImage =
    loadFabricImage === ""
      ? "http://aimoda-ai.oss-us-east-1.aliyuncs.com/3a982f03073f4c973cbb606541355c50.jpg"
      : loadFabricImage

  // 尝试调用 searchImage
  let shouldRunAllApis = false
  let similarImageUrl = ""

  try {
    const ImageResult = await errorCaptureRes(searchImage, loadOriginalImage || "")
    if (ImageResult[1]?.data?.similar_image_url) {
      similarImageUrl = ImageResult[1].data.similar_image_url
      shouldRunAllApis = true
    }
  } catch (error) {
    console.error("searchImage failed, will only run first 3 APIs:", error)
  }

  // 根据 searchImage 的结果决定调用哪些接口
  const apiCalls = [
    dressVariation20PCT({ ...p, loadFabricImage: newFabricImage }),
    dressVariation20PCT({ ...p, loadFabricImage: newFabricImage }),
    dressVariation20PCT({ ...p, loadFabricImage: newFabricImage }),
    dressVariation20PCT({ ...p, loadFabricImage: newFabricImage }),
    dressVariation20PCT({ ...p, loadFabricImage: newFabricImage }),
    dressVariation20PCT({ ...p, loadFabricImage: newFabricImage })
  ]

  const results = await Promise.allSettled(apiCalls)

  // 构建对应的请求参数数组
  const requestParams = [
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage }
  ]

  if (shouldRunAllApis) {
    const transferParamsForRequest = {
      loadOriginalImage: loadOriginalImage,
      loadFabricImage: similarImageUrl,
      backgroundColor,
      text,
      loadPrintingImage
    }

    requestParams.push(transferParamsForRequest)
  }

  // 过滤出成功的结果
  const successfulResults = results.filter(result => result.status === "fulfilled")

  // 提取每个成功结果中的 taskID 和请求参数
  const taskDetails = successfulResults.map((result, index) => {
    const taskID = result.value.data.taskID
    const params = requestParams[index]

    return {
      task_id: taskID,
      task_info: JSON.stringify(params)
    }
  })

  const job_id = uuidv4()
  const newObj = {
    job_id: job_id,
    tasks: taskDetails
  }

  // 调用 fetchAddBatch 请求接口
  fetchAddBatch(newObj)
    .then(() => {
      // 这里可以根据需要处理请求成功后的回调
    })
    .catch(err => {
      console.error("请求失败：", err)
    })

  const taskIDs = successfulResults.map(result => result.value.data.taskID)
  return taskIDs
}

export const workflow41 = async (p: Params) => {
  const { loadOriginalImage, loadPrintingImage, backgroundColor, text, loadFabricImage } = p
  const newFabricImage =
    loadFabricImage === ""
      ? "http://aimoda-ai.oss-us-east-1.aliyuncs.com/3a982f03073f4c973cbb606541355c50.jpg"
      : loadFabricImage

  // 尝试调用 searchImage
  let shouldRunAllApis = false
  let similarImageUrl = ""

  try {
    const ImageResult = await errorCaptureRes(searchImage, loadOriginalImage || "")
    if (ImageResult[1]?.data?.similar_image_url) {
      similarImageUrl = ImageResult[1].data.similar_image_url
      shouldRunAllApis = true
    }
  } catch (error) {
    console.error("searchImage failed, will only run first 3 APIs:", error)
  }

  // 根据 searchImage 的结果决定调用哪些接口
  const apiCalls = [
    dressVariation20PCT({ ...p, loadFabricImage: newFabricImage }),
    dressPatternVariation({ ...p, loadFabricImage: newFabricImage })
  ]

  // 如果 searchImage 成功，添加额外的 3 个接口调用
  if (shouldRunAllApis) {
    const transferParams = {
      loadAImage: loadOriginalImage,
      loadBImage: similarImageUrl,
      transferWeight: 0.2
    }

    apiCalls.push(
      TransferAAndBSTANDARD(transferParams),
      TransferAAndBSTANDARD(transferParams),
      TransferAAndBSTANDARD(transferParams),
      TransferAAndBSTANDARD(transferParams)
    )
  }

  const results = await Promise.allSettled(apiCalls)

  // 构建对应的请求参数数组
  const requestParams = [
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage }
  ]

  // 如果执行了全部接口，添加额外的参数
  if (shouldRunAllApis) {
    // 转换 transferParams 为符合 Params 类型的对象
    const transferParamsForRequest = {
      loadOriginalImage: loadOriginalImage,
      loadFabricImage: similarImageUrl,
      backgroundColor,
      text,
      loadPrintingImage
    }

    requestParams.push(transferParamsForRequest, transferParamsForRequest, transferParamsForRequest)
  }

  // 过滤出成功的结果
  const successfulResults = results.filter(result => result.status === "fulfilled")

  // 提取每个成功结果中的 taskID 和请求参数
  const taskDetails = successfulResults.map((result, index) => {
    const taskID = result.value.data.taskID
    const params = requestParams[index]

    return {
      task_id: taskID,
      task_info: JSON.stringify(params)
    }
  })

  const job_id = uuidv4()
  const newObj = {
    job_id: job_id,
    tasks: taskDetails
  }

  // 调用 fetchAddBatch 请求接口
  fetchAddBatch(newObj)
    .then(() => {
      // 这里可以根据需要处理请求成功后的回调
    })
    .catch(err => {
      console.error("请求失败：", err)
    })

  const taskIDs = successfulResults.map(result => result.value.data.taskID)
  return taskIDs
}

export const workflow444 = async (p: Params) => {
  const { loadOriginalImage, loadPrintingImage, backgroundColor, text, loadFabricImage } = p
  const newFabricImage =
    loadFabricImage === ""
      ? "http://aimoda-ai.oss-us-east-1.aliyuncs.com/3a982f03073f4c973cbb606541355c50.jpg"
      : loadFabricImage

  // 尝试调用 searchImage
  let shouldRunAllApis = false
  let similarImageUrl = ""

  try {
    const ImageResult = await errorCaptureRes(searchImage, loadOriginalImage || "")
    if (ImageResult[1]?.data?.similar_image_url) {
      similarImageUrl = ImageResult[1].data.similar_image_url
      shouldRunAllApis = true
    }
  } catch (error) {
    console.error("searchImage failed, will only run first 3 APIs:", error)
  }

  // 根据 searchImage 的结果决定调用哪些接口
  const apiCalls = []

  // 如果 searchImage 成功，添加额外的 3 个接口调用
  if (shouldRunAllApis) {
    const transferParams = {
      loadAImage: loadOriginalImage,
      loadBImage: similarImageUrl,
      transferWeight: 0.2
    }

    apiCalls.push(
      TransferAAndBSTANDARD(transferParams),
      TransferAAndBSTANDARD(transferParams),
      TransferAAndBSTANDARD(transferParams),
      TransferAAndBSTANDARD(transferParams),
      TransferAAndBSTANDARD(transferParams),
      TransferAAndBSTANDARD(transferParams)
    )
  }

  const results = await Promise.allSettled(apiCalls)

  // 构建对应的请求参数数组
  const requestParams: any[] = []

  // 如果执行了全部接口，添加额外的参数
  if (shouldRunAllApis) {
    // 转换 transferParams 为符合 Params 类型的对象
    const transferParamsForRequest = {
      loadOriginalImage: loadOriginalImage,
      loadFabricImage: similarImageUrl,
      backgroundColor,
      text,
      loadPrintingImage
    }

    requestParams.push(
      transferParamsForRequest,
      transferParamsForRequest,
      transferParamsForRequest,
      transferParamsForRequest,
      transferParamsForRequest,
      transferParamsForRequest
    )
  }

  // 过滤出成功的结果
  const successfulResults = results.filter(result => result.status === "fulfilled")

  // 提取每个成功结果中的 taskID 和请求参数
  const taskDetails = successfulResults.map((result, index) => {
    const taskID = result.value.data.taskID
    const params = requestParams[index]

    return {
      task_id: taskID,
      task_info: JSON.stringify(params)
    }
  })

  const job_id = uuidv4()
  const newObj = {
    job_id: job_id,
    tasks: taskDetails
  }

  // 调用 fetchAddBatch 请求接口
  fetchAddBatch(newObj)
    .then(() => {
      // 这里可以根据需要处理请求成功后的回调
    })
    .catch(err => {
      console.error("请求失败：", err)
    })

  const taskIDs = successfulResults.map(result => result.value.data.taskID)
  return taskIDs
}

export const workflow51 = async (p: Params) => {
  const { loadOriginalImage, loadPrintingImage, backgroundColor, text, loadFabricImage } = p
  const newFabricImage =
    loadFabricImage === ""
      ? "http://aimoda-ai.oss-us-east-1.aliyuncs.com/3a982f03073f4c973cbb606541355c50.jpg"
      : loadFabricImage

  // 尝试调用 searchImage
  let shouldRunAllApis = false
  let similarImageUrl = ""

  try {
    const ImageResult = await errorCaptureRes(searchImage, loadOriginalImage || "")
    if (ImageResult[1]?.data?.similar_image_url) {
      similarImageUrl = ImageResult[1].data.similar_image_url
      shouldRunAllApis = true
    }
  } catch (error) {
    console.error("searchImage failed, will only run first 3 APIs:", error)
  }

  // 根据 searchImage 的结果决定调用哪些接口
  const apiCalls = [
    dressVariation20PCT({ ...p, loadFabricImage: newFabricImage }),
    dressPatternVariation({ ...p, loadFabricImage: newFabricImage })
  ]

  // 如果 searchImage 成功，添加额外的 3 个接口调用
  if (shouldRunAllApis) {
    const transferParams = {
      loadAImage: loadOriginalImage,
      loadBImage: similarImageUrl,
      transferWeight: 0.2
    }

    apiCalls.push(
      TransferAAndBVITG(transferParams),
      TransferAAndBVITG(transferParams),
      TransferAAndBVITG(transferParams),
      TransferAAndBVITG(transferParams)
    )
  }

  const results = await Promise.allSettled(apiCalls)

  // 构建对应的请求参数数组
  const requestParams = [
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage }
  ]

  // 如果执行了全部接口，添加额外的参数
  if (shouldRunAllApis) {
    // 转换 transferParams 为符合 Params 类型的对象
    const transferParamsForRequest = {
      loadOriginalImage: loadOriginalImage,
      loadFabricImage: similarImageUrl,
      backgroundColor,
      text,
      loadPrintingImage
    }

    requestParams.push(transferParamsForRequest, transferParamsForRequest, transferParamsForRequest)
  }

  // 过滤出成功的结果
  const successfulResults = results.filter(result => result.status === "fulfilled")

  // 提取每个成功结果中的 taskID 和请求参数
  const taskDetails = successfulResults.map((result, index) => {
    const taskID = result.value.data.taskID
    const params = requestParams[index]

    return {
      task_id: taskID,
      task_info: JSON.stringify(params)
    }
  })

  const job_id = uuidv4()
  const newObj = {
    job_id: job_id,
    tasks: taskDetails
  }

  // 调用 fetchAddBatch 请求接口
  fetchAddBatch(newObj)
    .then(() => {
      // 这里可以根据需要处理请求成功后的回调
    })
    .catch(err => {
      console.error("请求失败：", err)
    })

  const taskIDs = successfulResults.map(result => result.value.data.taskID)
  return taskIDs
}

export const workflow555 = async (p: Params) => {
  const { loadOriginalImage, loadPrintingImage, backgroundColor, text, loadFabricImage } = p
  const newFabricImage =
    loadFabricImage === ""
      ? "http://aimoda-ai.oss-us-east-1.aliyuncs.com/3a982f03073f4c973cbb606541355c50.jpg"
      : loadFabricImage

  // 尝试调用 searchImage
  let shouldRunAllApis = false
  let similarImageUrl = ""

  try {
    const ImageResult = await errorCaptureRes(searchImage, loadOriginalImage || "")
    if (ImageResult[1]?.data?.similar_image_url) {
      similarImageUrl = ImageResult[1].data.similar_image_url
      shouldRunAllApis = true
    }
  } catch (error) {
    console.error("searchImage failed, will only run first 3 APIs:", error)
  }

  // 根据 searchImage 的结果决定调用哪些接口
  const apiCalls = []

  // 如果 searchImage 成功，添加额外的 3 个接口调用
  if (shouldRunAllApis) {
    const transferParams = {
      loadAImage: loadOriginalImage,
      loadBImage: similarImageUrl,
      transferWeight: 0.2
    }

    apiCalls.push(
      TransferAAndBVITG(transferParams),
      TransferAAndBVITG(transferParams),
      TransferAAndBVITG(transferParams),
      TransferAAndBVITG(transferParams),
      TransferAAndBVITG(transferParams),
      TransferAAndBVITG(transferParams)
    )
  }

  const results = await Promise.allSettled(apiCalls)

  // 构建对应的请求参数数组
  const requestParams: any[] = []

  // 如果执行了全部接口，添加额外的参数
  if (shouldRunAllApis) {
    // 转换 transferParams 为符合 Params 类型的对象
    const transferParamsForRequest = {
      loadOriginalImage: loadOriginalImage,
      loadFabricImage: similarImageUrl,
      backgroundColor,
      text,
      loadPrintingImage
    }

    requestParams.push(
      transferParamsForRequest,
      transferParamsForRequest,
      transferParamsForRequest,
      transferParamsForRequest,
      transferParamsForRequest,
      transferParamsForRequest
    )
  }

  // 过滤出成功的结果
  const successfulResults = results.filter(result => result.status === "fulfilled")

  // 提取每个成功结果中的 taskID 和请求参数
  const taskDetails = successfulResults.map((result, index) => {
    const taskID = result.value.data.taskID
    const params = requestParams[index]

    return {
      task_id: taskID,
      task_info: JSON.stringify(params)
    }
  })

  const job_id = uuidv4()
  const newObj = {
    job_id: job_id,
    tasks: taskDetails
  }

  // 调用 fetchAddBatch 请求接口
  fetchAddBatch(newObj)
    .then(() => {
      // 这里可以根据需要处理请求成功后的回调
    })
    .catch(err => {
      console.error("请求失败：", err)
    })

  const taskIDs = successfulResults.map(result => result.value.data.taskID)
  return taskIDs
}

export const workflow61 = async (p: Params) => {
  const { loadOriginalImage, loadPrintingImage, backgroundColor, text, loadFabricImage } = p
  const newFabricImage =
    loadFabricImage === ""
      ? "http://aimoda-ai.oss-us-east-1.aliyuncs.com/3a982f03073f4c973cbb606541355c50.jpg"
      : loadFabricImage

  // 尝试调用 searchImage
  let shouldRunAllApis = false
  let similarImageUrl = ""

  try {
    const ImageResult = await errorCaptureRes(searchImage, loadOriginalImage || "")
    if (ImageResult[1]?.data?.similar_image_url) {
      similarImageUrl = ImageResult[1].data.similar_image_url
      shouldRunAllApis = true
    }
  } catch (error) {
    console.error("searchImage failed, will only run first 3 APIs:", error)
  }

  // 根据 searchImage 的结果决定调用哪些接口
  const apiCalls = [
    dressVariation20PCT({ ...p, loadFabricImage: newFabricImage }),
    dressPatternVariation({ ...p, loadFabricImage: newFabricImage })
  ]

  // 如果 searchImage 成功，添加额外的 3 个接口调用
  if (shouldRunAllApis) {
    const transferParams = {
      loadAImage: loadOriginalImage,
      loadBImage: similarImageUrl,
      transferWeight: 0.2
    }

    apiCalls.push(
      TransferAAndBPlus(transferParams),
      TransferAAndBPlus(transferParams),
      TransferAAndBPlus(transferParams),
      TransferAAndBPlus(transferParams)
    )
  }

  const results = await Promise.allSettled(apiCalls)

  // 构建对应的请求参数数组
  const requestParams = [
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage }
  ]

  // 如果执行了全部接口，添加额外的参数
  if (shouldRunAllApis) {
    // 转换 transferParams 为符合 Params 类型的对象
    const transferParamsForRequest = {
      loadOriginalImage: loadOriginalImage,
      loadFabricImage: similarImageUrl,
      backgroundColor,
      text,
      loadPrintingImage
    }

    requestParams.push(transferParamsForRequest, transferParamsForRequest, transferParamsForRequest)
  }

  // 过滤出成功的结果
  const successfulResults = results.filter(result => result.status === "fulfilled")

  // 提取每个成功结果中的 taskID 和请求参数
  const taskDetails = successfulResults.map((result, index) => {
    const taskID = result.value.data.taskID
    const params = requestParams[index]

    return {
      task_id: taskID,
      task_info: JSON.stringify(params)
    }
  })

  const job_id = uuidv4()
  const newObj = {
    job_id: job_id,
    tasks: taskDetails
  }

  // 调用 fetchAddBatch 请求接口
  fetchAddBatch(newObj)
    .then(() => {
      // 这里可以根据需要处理请求成功后的回调
    })
    .catch(err => {
      console.error("请求失败：", err)
    })

  const taskIDs = successfulResults.map(result => result.value.data.taskID)
  return taskIDs
}

export const workflow666 = async (p: Params) => {
  const { loadOriginalImage, loadPrintingImage, backgroundColor, text, loadFabricImage } = p
  const newFabricImage =
    loadFabricImage === ""
      ? "http://aimoda-ai.oss-us-east-1.aliyuncs.com/3a982f03073f4c973cbb606541355c50.jpg"
      : loadFabricImage

  // 尝试调用 searchImage
  let shouldRunAllApis = false
  let similarImageUrl = ""

  try {
    const ImageResult = await errorCaptureRes(searchImage, loadOriginalImage || "")
    if (ImageResult[1]?.data?.similar_image_url) {
      similarImageUrl = ImageResult[1].data.similar_image_url
      shouldRunAllApis = true
    }
  } catch (error) {
    console.error("searchImage failed, will only run first 3 APIs:", error)
  }

  // 根据 searchImage 的结果决定调用哪些接口
  const apiCalls = []

  // 如果 searchImage 成功，添加额外的 3 个接口调用
  if (shouldRunAllApis) {
    const transferParams = {
      loadAImage: loadOriginalImage,
      loadBImage: similarImageUrl,
      transferWeight: 0.2
    }

    apiCalls.push(
      TransferAAndBPlus(transferParams),
      TransferAAndBPlus(transferParams),
      TransferAAndBPlus(transferParams),
      TransferAAndBPlus(transferParams),
      TransferAAndBPlus(transferParams),
      TransferAAndBPlus(transferParams)
    )
  }

  const results = await Promise.allSettled(apiCalls)

  // 构建对应的请求参数数组
  const requestParams: any[] = []

  // 如果执行了全部接口，添加额外的参数
  if (shouldRunAllApis) {
    // 转换 transferParams 为符合 Params 类型的对象
    const transferParamsForRequest = {
      loadOriginalImage: loadOriginalImage,
      loadFabricImage: similarImageUrl,
      backgroundColor,
      text,
      loadPrintingImage
    }

    requestParams.push(
      transferParamsForRequest,
      transferParamsForRequest,
      transferParamsForRequest,
      transferParamsForRequest,
      transferParamsForRequest,
      transferParamsForRequest
    )
  }

  // 过滤出成功的结果
  const successfulResults = results.filter(result => result.status === "fulfilled")

  // 提取每个成功结果中的 taskID 和请求参数
  const taskDetails = successfulResults.map((result, index) => {
    const taskID = result.value.data.taskID
    const params = requestParams[index]

    return {
      task_id: taskID,
      task_info: JSON.stringify(params)
    }
  })

  const job_id = uuidv4()
  const newObj = {
    job_id: job_id,
    tasks: taskDetails
  }

  // 调用 fetchAddBatch 请求接口
  fetchAddBatch(newObj)
    .then(() => {
      // 这里可以根据需要处理请求成功后的回调
    })
    .catch(err => {
      console.error("请求失败：", err)
    })

  const taskIDs = successfulResults.map(result => result.value.data.taskID)
  return taskIDs
}

export const workflow1_7 = async (p: Params) => {
  const { loadOriginalImage, loadPrintingImage, backgroundColor, text, loadFabricImage } = p
  const newFabricImage =
    loadFabricImage === ""
      ? "http://aimoda-ai.oss-us-east-1.aliyuncs.com/3a982f03073f4c973cbb606541355c50.jpg"
      : loadFabricImage

  // 根据 searchImage 的结果决定调用哪些接口
  const apiCalls = [
    imageAndTextGpt({ ...p, loadFabricImage: newFabricImage }),
    imageAndTextGpt({ ...p, loadFabricImage: newFabricImage }),
    imageAndTextGpt({ ...p, loadFabricImage: newFabricImage }),
    imageAndTextGpt({ ...p, loadFabricImage: newFabricImage }),
    imageAndTextGpt({ ...p, loadFabricImage: newFabricImage }),
    imageAndTextGpt({ ...p, loadFabricImage: newFabricImage })
  ]

  const results = await Promise.allSettled(apiCalls)

  // 构建对应的请求参数数组
  const requestParams = [
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage }
  ]

  // 过滤出成功的结果
  const successfulResults = results.filter(result => result.status === "fulfilled")

  // 提取每个成功结果中的 taskID 和请求参数
  const taskDetails = successfulResults.map((result, index) => {
    const taskID = result.value.data.taskID
    const params = requestParams[index]

    return {
      task_id: taskID,
      task_info: JSON.stringify(params)
    }
  })

  const job_id = uuidv4()
  const newObj = {
    job_id: job_id,
    tasks: taskDetails
  }

  // 调用 fetchAddBatch 请求接口
  fetchAddBatch(newObj)
    .then(() => {
      // 这里可以根据需要处理请求成功后的回调
    })
    .catch(err => {
      console.error("请求失败：", err)
    })

  const taskIDs = successfulResults.map(result => result.value.data.taskID)
  return taskIDs
}

export const workflow1_8 = async (p: Params) => {
  console.log(888)
  const { loadOriginalImage, loadPrintingImage, backgroundColor, text, loadFabricImage } = p
  const newFabricImage = "http://aimoda-ai.oss-us-east-1.aliyuncs.com/3a982f03073f4c973cbb606541355c50.jpg"
  const apiCalls = [
    imageAndTextGpt({ ...p }),
    imageAndTextGpt({ ...p }),
    imageAndTextGpt({ ...p }),
    imageAndTextGpt({ ...p }),
    imageAndTextGpt({ ...p }),
    imageAndTextGpt({ ...p })
  ]

  const results = await Promise.allSettled(apiCalls)
  const midImage: any[] = []
  const successfulResults = results.filter(result => result.status === "fulfilled")
  let midTaskIDs = successfulResults.map(result => result.value.data.taskID)
  return new Promise<string[]>((resolve, reject) => {
    const interval = setInterval(async () => {
      for (let index = 0; index < midTaskIDs.length; index++) {
        const taskID = midTaskIDs[index]
        try {
          const resultData: any = await getQuery({ taskID })
          const { result, success, message } = resultData || {}
          if (success) {
            console.log(`Task ${taskID} completed`)
            midTaskIDs = midTaskIDs.filter(id => id !== taskID)
            midImage.push(result.res)
          } else {
            console.log(`Task ${taskID} still in progress`)
          }
          if (message !== "Task is running") {
            midTaskIDs = midTaskIDs.filter(id => id !== taskID)
          }
        } catch (error) {
          console.error(`Error fetching result for task ${taskID}:`, error)
        }
      }

      if (midTaskIDs.length === 0) {
        clearInterval(interval)

        const requestParams = [
          {
            ...p,
            loadPrintingImage: loadPrintingImage,
            loadOriginalImage: midImage[0],
            loadFabricImage: newFabricImage
          },
          {
            ...p,
            loadPrintingImage: loadPrintingImage,
            loadOriginalImage: midImage[1],
            loadFabricImage: newFabricImage
          },
          {
            ...p,
            loadPrintingImage: loadPrintingImage,
            loadOriginalImage: midImage[2],
            loadFabricImage: newFabricImage
          },
          {
            ...p,
            loadPrintingImage: loadPrintingImage,
            loadOriginalImage: midImage[3],
            loadFabricImage: newFabricImage
          },
          {
            ...p,
            loadPrintingImage: loadPrintingImage,
            loadOriginalImage: midImage[4],
            loadFabricImage: newFabricImage
          },
          {
            ...p,
            loadPrintingImage: loadPrintingImage,
            loadOriginalImage: midImage[5],
            loadFabricImage: newFabricImage
          }
        ]
        console.log(requestParams)

        // 执行所有请求
        const results = await Promise.allSettled(requestParams.map(params => dressPrintingTryon(params)))

        // 过滤出成功的结果
        const successfulResults = results.filter(result => result.status === "fulfilled")

        // 提取每个成功结果中的 taskID 和请求参数
        const taskDetails = successfulResults.map((result, index) => {
          const taskID = result.value.data.taskID // 从成功的结果中提取 taskID

          // 获取对应的请求参数
          const params = requestParams[index]

          return {
            task_id: taskID,
            task_info: JSON.stringify(params) // 将请求参数对象转换为 JSON 字符串
          }
        })
        const job_id = uuidv4()
        // 构造新的请求体对象
        const newObj = {
          job_id: job_id,
          tasks: taskDetails
        }

        // 调用 fetchAddBatch 请求接口
        fetchAddBatch(newObj)
          .then(() => {
            // 这里可以根据需要处理请求成功后的回调
          })
          .catch(err => {
            // 处理请求失败的情况
            console.error("请求失败：", err)
          })
        const taskIDs = successfulResults.map(result => result.value.data.taskID)
        resolve(taskIDs)

        // const results = await Promise.allSettled([
        //   dressPrintingTryon({
        //     ...p,
        //     loadPrintingImage: midImage[0],
        //     loadFabricImage: newFabricImage
        //   }),
        //   dressPrintingTryon({
        //     ...p,
        //     loadPrintingImage: midImage[1],
        //     loadOriginalImage: res.data[0].image_url,
        //     loadFabricImage: newFabricImage
        //   }),
        //   dressPrintingTryon({
        //     ...p,
        //     loadPrintingImage: midImage[2],
        //     loadOriginalImage: res.data[1].image_url,
        //     loadFabricImage: newFabricImage
        //   }),
        //   dressPrintingTryon({
        //     ...p,
        //     loadPrintingImage: midImage[3],
        //     loadOriginalImage: res.data[2].image_url,
        //     loadFabricImage: newFabricImage
        //   }),
        //   dressPrintingTryon({
        //     ...p,
        //     loadPrintingImage: midImage[4],
        //     loadOriginalImage: res.data[3].image_url,
        //     loadFabricImage: newFabricImage
        //   }),
        //   dressPrintingTryon({
        //     ...p,
        //     loadPrintingImage: midImage[5],
        //     loadOriginalImage: res.data[4].image_url,
        //     loadFabricImage: newFabricImage
        //   })
        // ])
        // const successfulResults = results.filter(result => result.status === "fulfilled")
        // const failedResults = results.filter(result => result.status === "rejected")

        // const taskIDs = successfulResults.map(result => result.value.data.taskID)
        // console.log("Successful task IDs:", taskIDs)

        // failedResults.forEach(result => {
        //   console.error("Failure:", result.reason)
        //   if (result.reason.code === "ERR_NETWORK") {
        //     console.error("Network Error:", result.reason.message)
        //   }
        // })

        // resolve(taskIDs)
      }
    }, 15000)
  })
}

export const workflow1_9 = async (p: Params) => {
  const { loadOriginalImage, loadPrintingImage, backgroundColor, text, loadFabricImage } = p
  const newFabricImage = "http://aimoda-ai.oss-us-east-1.aliyuncs.com/3a982f03073f4c973cbb606541355c50.jpg"
  console.log(222)
  const [err, res] = await errorCaptureRes(fetchHomePage, {
    limit: 5,
    offset: Math.floor(Math.random() * 46),
    library: "show-new"
  })
  console.log(res.data)

  // 存储每次请求的参数
  const requestParams = [
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage, loadOriginalImage: res.data[0].image_url },
    { ...p, loadFabricImage: newFabricImage, loadOriginalImage: res.data[1].image_url },
    { ...p, loadFabricImage: newFabricImage, loadOriginalImage: res.data[2].image_url },
    { ...p, loadFabricImage: newFabricImage, loadOriginalImage: res.data[3].image_url },
    { ...p, loadFabricImage: newFabricImage, loadOriginalImage: res.data[4].image_url }
  ]

  // 执行所有请求
  const results = await Promise.allSettled(requestParams.map(params => dressPrintingTryon(params)))
  console.log("results", results)
  // 过滤出成功的结果
  const successfulResults = results.filter(result => result.status === "fulfilled")
  // 提取每个成功结果中的 taskID 和请求参数
  const taskDetails = successfulResults.map((result, index) => {
    const taskID = result?.value.data.taskID // 从成功的结果中提取 taskID

    // 获取对应的请求参数
    const params = requestParams[index]

    return {
      task_id: taskID,
      task_info: JSON.stringify(params) // 将请求参数对象转换为 JSON 字符串
    }
  })
  const job_id = uuidv4()
  // 构造新的请求体对象
  const newObj = {
    job_id: job_id,
    tasks: taskDetails
  }

  // 调用 fetchAddBatch 请求接口
  fetchAddBatch(newObj)
    .then(() => {
      // 这里可以根据需要处理请求成功后的回调
    })
    .catch(err => {
      // 处理请求失败的情况
      console.error("请求失败：", err)
    })
  const taskIDs = successfulResults.map(result => result.value.data.taskID)
  return taskIDs
}
