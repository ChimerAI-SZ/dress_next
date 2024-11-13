"use client"

import { Container, Flex, Image, Box, Show } from "@chakra-ui/react"

import Empty from "app/components/Empty"

import { FavouriteItem } from "@definitions/favourites"

export default function Favourites({ favouriteData }: { favouriteData: FavouriteItem }) {
  return (
    <Container px={"0"}>
      <Flex direction={"column"} alignItems={"center"}>
        <Flex position={"relative"} w={"100%"} h={143} borderRadius={"20pt"} overflow={"hidden"} gap={"4pt"}>
          <Show
            when={Array.isArray(favouriteData.images) && favouriteData.images.length >= 3}
            fallback={
              <Show
                when={Array.isArray(favouriteData.images) && favouriteData.images.length >= 1}
                fallback={<Empty style={{ bg: "#F0F0F0", display: "flex", alignItems: "center", justifyContent: "center" }} />}
              >
                <Image w="100%" minH={"calc(50% - 2pt)"} zIndex={1} src={favouriteData.images[0]} />
              </Show>
            }
          >
            {/* 有三张图片时分栏展示 */}
            <Box w={"calc(60% - 2pt)"} flex={"none"} borderRadius={"4pt"} overflow={"hidden"}>
              <Image w={"100%"} h={"100%"} src={favouriteData.images[0]} />
            </Box>
            <Box w={"calc(40% - 2pt)"} flex={"none"} position={"relative"} overflow={"hidden"}>
              <Image w="100%" minH={"calc(50% - 2pt)"} borderRadius={"4pt"} overflow={"hidden"} marginBottom={"4pt"} top="0" position={"absolute"} zIndex={1} src={favouriteData.images[1]} />
              <Image w="100%" minH={"calc(50% - 2pt)"} borderRadius={"4pt"} overflow={"hidden"} top={"50%"} position={"absolute"} zIndex={1} src={favouriteData.images[2]} />
            </Box>
          </Show>
        </Flex>
        <Box mt={"8pt"} w={"100%"} color="#171717" fontSize={"1rem"} overflow={"hidden"} whiteSpace={"nowrap"} textOverflow={"ellipsis"}>
          {favouriteData.title}
        </Box>
        <Box h={"22px"} w={"100%"} color="#171717" fontSize={"0.8rem"} fontWeight={"400"}>
          {favouriteData.total}
        </Box>
      </Flex>
    </Container>
  )
}
