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
  searchImage
} from "@lib/request/workflow" // B1 全维度保持80%(77s)
import { getQuery, fetchAddBatch } from "@lib/request/generate"
import { fetchHomePage } from "@lib/request/page"
import { errorCaptureRes } from "@utils/index"

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
    library: "top_sales"
  })
  console.log(res.data)
  // const results = await Promise.allSettled([
  //   dressPrintingTryon({ ...p, loadFabricImage: newFabricImage }),
  //   dressPrintingTryon({ ...p, loadFabricImage: newFabricImage, loadOriginalImage: res.data[0].image_url }),
  //   dressPrintingTryon({ ...p, loadFabricImage: newFabricImage, loadOriginalImage: res.data[1].image_url }),
  //   dressPrintingTryon({ ...p, loadFabricImage: newFabricImage, loadOriginalImage: res.data[2].image_url }),
  //   dressPrintingTryon({ ...p, loadFabricImage: newFabricImage, loadOriginalImage: res.data[3].image_url }),
  //   dressPrintingTryon({ ...p, loadFabricImage: newFabricImage, loadOriginalImage: res.data[4].image_url })
  // ])

  // const successfulResults = results.filter(result => result.status === "fulfilled")
  // const failedResults = results.filter(result => result.status === "rejected")

  // const taskIDs = successfulResults.map(result => result.value.data.taskID)
  // console.log("Successful task IDs:", taskIDs)
  // console.log("sueccessful taskid id ,taskid")
  // failedResults.forEach(result => {
  //   console.error("Failure:", result.reason)
  //   if (result.reason.code === "ERR_NETWORK") {
  //     console.error("Network Error:", result.reason.message)
  //   }
  // })

  // return taskIDs

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
    library: "top_sales"
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
    library: "top_sales"
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
    library: "top_sales"
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

export const workflow1_6 = async (p: Params) => {
  const { loadOriginalImage, loadPrintingImage, backgroundColor, text, loadFabricImage } = p
  const newFabricImage =
    loadFabricImage === ""
      ? "http://aimoda-ai.oss-us-east-1.aliyuncs.com/3a982f03073f4c973cbb606541355c50.jpg"
      : loadFabricImage
  const ImageResult = await errorCaptureRes(searchImage, loadOriginalImage || "")
  const results = await Promise.allSettled([
    dressVariation20PCT({ ...p, loadFabricImage: newFabricImage }),
    dressPatternVariation({ ...p, loadFabricImage: newFabricImage }),
    dressVariation50PCT({ ...p, loadFabricImage: newFabricImage }),
    TransferAAndBPlus({
      loadAImage: loadOriginalImage,
      loadBImage: ImageResult[1].data.similar_image_url,
      transferWeight: 0.2
    }),
    TransferAAndBVITG({
      loadAImage: loadOriginalImage,
      loadBImage: ImageResult[1].data.similar_image_url,
      transferWeight: 0.2
    }),
    TransferAAndBSTANDARD({
      loadAImage: loadOriginalImage,
      loadBImage: ImageResult[1].data.similar_image_url,
      transferWeight: 0.2
    })
  ])

  const requestParams = [
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage },
    { ...p, loadFabricImage: newFabricImage },
    {
      loadAImage: loadOriginalImage,
      loadBImage: ImageResult[1].data.similar_image_url,
      transferWeight: 0.2
    },
    {
      loadAImage: loadOriginalImage,
      loadBImage: ImageResult[1].data.similar_image_url,
      transferWeight: 0.2
    },
    {
      loadAImage: loadOriginalImage,
      loadBImage: ImageResult[1].data.similar_image_url,
      transferWeight: 0.2
    }
  ]

  // 执行所有请求
  // const results = await Promise.allSettled(requestParams.map(params => dressPrintingTryon(params)))

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
  return taskIDs

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

  // return taskIDs
}
