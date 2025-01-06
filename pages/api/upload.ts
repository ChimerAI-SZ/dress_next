import { NextApiRequest, NextApiResponse } from "next"
import OSS from "ali-oss"
import formidable from "formidable"
import fs from "fs"
import crypto from "crypto"

export const config = {
  api: {
    bodyParser: false
  }
}

const hashFileName = (fileName: string): string => {
  return crypto.createHash("sha256").update(fileName).digest("hex")
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  // 验证环境变量
  const requiredEnvVars = [
    "NEXT_PUBLIC_OSS_REGION",
    "NEXT_PUBLIC_OSS_ACCESS_KEY_ID",
    "NEXT_PUBLIC_OSS_ACCESS_KEY_SECRET",
    "NEXT_PUBLIC_OSS_BUCKET"
  ]
  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName])

  if (missingEnvVars.length > 0) {
    console.error(`Missing environment variables: ${missingEnvVars.join(", ")}`)
    return res.status(500).json({ message: "Server configuration error" })
  }

  try {
    const form = formidable({
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024 // 10MB
    })

    const [_, files] = await form.parse(req)
    const file = files.file?.[0]

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" })
    }

    const client = new OSS({
      region: process.env.NEXT_PUBLIC_OSS_REGION!,
      accessKeyId: process.env.NEXT_PUBLIC_OSS_ACCESS_KEY_ID!,
      accessKeySecret: process.env.NEXT_PUBLIC_OSS_ACCESS_KEY_SECRET!,
      bucket: process.env.NEXT_PUBLIC_OSS_BUCKET!
    })

    const hashedFileName = hashFileName(file.originalFilename || "unnamed")
    const fileName = `${hashedFileName}.jpg`

    const fileContent = fs.readFileSync(file.filepath)
    const result = await client.put(fileName, fileContent)

    // 清理临时文件
    fs.unlinkSync(file.filepath)

    const uploadedUrl = `https://${process.env.NEXT_PUBLIC_OSS_BUCKET}.${process.env.NEXT_PUBLIC_OSS_REGION}.aliyuncs.com/${result.name}?x-oss-process=image/format,jpg`

    return res.status(200).json({ url: uploadedUrl })
  } catch (error) {
    console.error("Upload error:", error)
    return res.status(500).json({
      message: "Error uploading file",
      error: error instanceof Error ? error.message : String(error)
    })
  }
}
