import { Container } from '@chakra-ui/react'
import Header from './components/Header'
import { Field } from '@components/ui/field'

function Page() {
  return (
    <Container maxW="container.lg">
      <Header name="Like" addBtnvisible />
      <Field />
    </Container>
  )
}

export default Page
