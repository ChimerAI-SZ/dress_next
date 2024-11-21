"use client"
import Head from "./head"
import Provider from "./provider"
import { Suspense } from "react"
import { Helmet } from "react-helmet"

import "./global.css"

import type { Viewport } from "next"

export const viewport: Viewport = {
  themeColor: "black"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head></head>
      <body
        style={{
          overflow: "auto"
        }}
      >
        <Suspense>
          <Helmet>
            <title>CREAMODA</title>
            <link rel="icon" href="/icon.png" />
            <meta
              name="description"
              content="Introducing CREAMODA, an unprecedented clothing generative engine. At CREAMODA, we offer an intelligent fashion platform designed to bring your creative ambitions to life. With our state-of-the-art generative clothing engine, CREAMODA transforms your vision into top-selling fashion, seamlessly and efficiently. Whether you’re shaping trends or creating unique designs, CREAMODA empowers you to bring your ideas to market with ease."
            />
            <meta
              name="keywords"
              content="AI fashion creation Generative clothing engine AI-driven fashion platform Fashion design automation Seamless fashion design Top-selling fashion designs AI fashion technology Intelligent fashion design Creative fashion platform Automated garment creation"
            />
            {/* 解决浏览器在聚焦输入框时缩放的问题 begins  */}
            {/* 解决方式是禁止浏览器缩放（同时会仅用用户的缩放） */}
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
            />
            {/* 解决浏览器在聚焦输入框时缩放的问题 ends  */}
          </Helmet>
          <Provider>{children}</Provider>
        </Suspense>
      </body>
    </html>
  )
}
