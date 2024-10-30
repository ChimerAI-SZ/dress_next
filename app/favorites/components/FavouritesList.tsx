import { Container, For, Flex } from '@chakra-ui/react'

import { FavouriteItem } from '@definitions/favourites'

import Favourites from './Favourites'

import { featchFavouritesList } from '../mock'

export default async function CustomersTable() {
  const revenue: FavouriteItem[] = await featchFavouritesList()

  return (
    <Container p={0}>
      <Flex direction="row" wrap={'wrap'}>
        <For each={revenue}>{(item: FavouriteItem, index: number) => <Favourites favouriteData={item} key={item.id + index} />}</For>
      </Flex>
    </Container>
  )
}
