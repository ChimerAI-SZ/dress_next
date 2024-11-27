import { Metadata } from "next"
import { LoginPage } from "./components/LoginPage"

export const metadata: Metadata = {
  title: "Login - CREAMODA",
  description: "Login to access your account"
}

export const dynamic = "force-static"
export const revalidate = 3600
export const fetchCache = "force-cache"

export default function Page() {
  return <LoginPage />
}
