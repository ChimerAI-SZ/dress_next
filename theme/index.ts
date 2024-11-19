import { createSystem, defaultConfig } from "@chakra-ui/react"

// tokens: https://chakra-v3-docs.vercel.app/docs/theming/tokens
export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: { value: `'Comfortaa', sans-serif` },
        body: { value: `'Comfortaa', sans-serif` }
      }
    }
  }
})
