"use client"

import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { Provider } from "@components/ui/provider"
import { system } from "../theme/index"

export default function RootLayout(props: { children: React.ReactNode }) {
  return <ChakraProvider value={system}>{props.children}</ChakraProvider>
}
