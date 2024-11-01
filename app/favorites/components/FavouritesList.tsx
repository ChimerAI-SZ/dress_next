import { Container, For, Flex } from '@chakra-ui/react'
import Link from 'next/link'

import { FavouriteItem } from '@definitions/favourites'

import Favourites from './Favourites'

import { featchFavouritesList } from '../mock'
import styled from '@emotion/styled'

interface NextRouter {
  pathname: string
  query?: { name: string }
}

export default async function CustomersTable() {
  const revenue: FavouriteItem[] = await featchFavouritesList()

  return (
    <Container p={0}>
      <Flex direction="row" wrap={'wrap'}>
        <For each={revenue}>
          {(item: FavouriteItem, index: number) => (
            <StyledLink
              href={{
                pathname: `/favorites/${item.id}`,
                query: { name: encodeURIComponent(item.name) } as NextRouter['query']
              }}
              key={item.id + index}
            >
              <Favourites favouriteData={item} />
            </StyledLink>
          )}
        </For>
      </Flex>
    </Container>
  )
}

const StyledLink = styled(Link)`
  display: block;
  width: 50%;
`
