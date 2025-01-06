import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "URL is required" })
  }

  // 安全检查：只允许从特定域名获取图片
  const allowedDomains = [
    "aimoda-ai.oss-us-east-1.aliyuncs.com",
    "creamoda.oss-us-west-1.aliyuncs.com",
    "creamoda-gallary.oss-us-west-1.aliyuncs.com",
    "creamoda-gallary.oss-accelerate.aliyuncs.com",
    "creamoda-front-end.oss-us-west-1.aliyuncs.com"
  ]

  try {
    const imageUrl = new URL(url)
    if (!allowedDomains.some(domain => imageUrl.hostname.includes(domain))) {
      return res.status(403).json({ error: "Domain not allowed" })
    }

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const contentType = response.headers.get("content-type")
    if (!contentType?.startsWith("image/")) {
      return res.status(400).json({ error: "Not an image" })
    }

    // 设置缓存头
    res.setHeader("Cache-Control", "public, max-age=86400") // 24小时缓存
    res.setHeader("Content-Type", contentType)

    const blob = await response.blob()
    const buffer = Buffer.from(await blob.arrayBuffer())
    res.send(buffer)
  } catch (error) {
    console.error("Proxy image error:", error)
    res.status(500).json({ error: "Failed to fetch image" })
  }
}
