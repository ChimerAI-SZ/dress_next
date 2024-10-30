import { Container } from '@chakra-ui/react'
import Header from './components/Header'
import { DecorativeBox } from 'compositions/lib/decorative-box'

function Page() {
  return (
    <Container maxW="container.lg">
      <Header name="Like" addBtnvisible />
      <DecorativeBox px="2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam consectetur, tortor in lacinia eleifend, dui nisl tristique nunc.</DecorativeBox>
    </Container>
  )
}

export default Page
