"use client";
import Provider from "./provider";
import { Suspense } from "react";
import "./global.css";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head />
      <body
        style={{
          overflow: "auto",
        }}
      >
        <Suspense>
          <Provider>{children}</Provider>
        </Suspense>
      </body>
    </html>
  );
}
