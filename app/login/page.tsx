import { Suspense } from "react"
import { LoginPage } from "./components/LoginPage"
import { Loading } from "@components/Loading"

export const metadata = {
  title: "Login - CREAMODA",
  description: "Login to access your account"
}

export const dynamic = "auto"
export const revalidate = false

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginPage />
    </Suspense>
  )
}
