"use client"
import Head from "./head"
import Provider from "./provider"
import { Suspense } from "react"
import "./global.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <meta
          name="description"
          content="Introducing CREAMODA, an unprecedented clothing generative engine. At CREAMODA, we offer an intelligent fashion platform designed to bring your creative ambitions to life. With our state-of-the-art generative clothing engine, CREAMODA transforms your vision into top-selling fashion, seamlessly and efficiently. Whether you’re shaping trends or creating unique designs, CREAMODA empowers you to bring your ideas to market with ease."
        />
        <meta
          name="keywords"
          content="AI fashion creation
Generative clothing engine
AI-driven fashion platform
Fashion design automation
Seamless fashion design
Top-selling fashion designs
AI fashion technology
Intelligent fashion design
Creative fashion platform
Automated garment creation"
        />
        <link rel="icon" href="/icon.png" />
      </head>
      <body
        style={{
          overflow: "auto"
        }}
      >
        <Suspense>
          <Provider>{children}</Provider>
        </Suspense>
      </body>
    </html>
  )
}
