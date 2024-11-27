import { Suspense } from "react"
import { RetrievePasswordPage } from "./components/RetrievePasswordPage"
import { Loading } from "@components/Loading"

export const metadata = {
  title: "Retrieve Password - CREAMODA",
  description: "Reset your password"
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <RetrievePasswordPage />
    </Suspense>
  )
}
