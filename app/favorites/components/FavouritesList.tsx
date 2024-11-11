import { Container, For, Flex } from '@chakra-ui/react'
import Link from 'next/link'

import { FavouriteItem } from '@definitions/favourites'

import Favourites from './Favourites'

import styled from '@emotion/styled'

interface NextRouter {
  pathname: string
  query?: { name: string }
}
interface CustomersTableProps {
  collectionList: FavouriteItem[]
}

const CustomersTable: React.FC<CustomersTableProps> = ({ collectionList }) => {
  return (
    <Container p={'8pt 12pt'}>
      <Flex direction="row" wrap={'wrap'} gap={'12pt'}>
        <For each={collectionList}>
          {(item: FavouriteItem, index: number) => (
            <StyledLink
              href={{
                pathname: `/favorites/${item.collection_id}`,
                query: { name: encodeURIComponent(item.title) } as NextRouter['query']
              }}
              key={item.collection_id + '' + index}
            >
              <Favourites favouriteData={item} />
            </StyledLink>
          )}
        </For>
      </Flex>
    </Container>
  )
}

export default CustomersTable

const StyledLink = styled(Link)`
  display: block;
  width: calc(50% - 6pt);
`
