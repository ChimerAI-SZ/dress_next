import { Container } from '@chakra-ui/react'
import Header from './components/Header'
import FavouritesList from './components/FavouritesList'

function Page() {
  return (
    <Container maxW="container.lg">
      <Header name="Like" addBtnvisible />
      <FavouritesList />
    </Container>
  )
}

export default Page
