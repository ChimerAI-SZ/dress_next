import { Container, For, Flex } from "@chakra-ui/react"
import Link from "next/link"

import { AlbumItem } from "@definitions/album"

import Album from "./Album"

import styled from "@emotion/styled"

interface NextRouter {
  pathname: string
  query?: { name: string }
}
interface CustomersTableProps {
  albumList: AlbumItem[]
}

const CustomersTable: React.FC<CustomersTableProps> = ({ albumList }) => {
  return (
    <Container p={"8pt 12pt"}>
      <Flex direction="row" wrap={"wrap"} gap={"12pt"}>
        <For each={albumList}>
          {(item: AlbumItem, index: number) => (
            <StyledLink
              href={{
                pathname: `/album/${item.collection_id}`,
                query: { name: encodeURIComponent(item.title) } as NextRouter["query"]
              }}
              key={item.collection_id + "" + index}
            >
              <Album albumData={item} />
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
