"use client"
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { Provider } from "react-redux"
import store from "@store/index"
export default function ReduxProvider(props: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ChakraProvider value={defaultSystem}>{props.children} </ChakraProvider>
    </Provider>
  )
}
