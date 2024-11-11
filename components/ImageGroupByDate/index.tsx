import styled from "@emotion/styled"
import dayjs from "dayjs"
import { Box, For, Grid, GridItem, Image, Show } from "@chakra-ui/react"

import selectedIcon from "@img/favourites/selectedIcon.svg"
import unselectedIcon from "@img/favourites/unselectedIcon.svg"

interface ImageGroupByDataProps {
  date: string
  imageList: string[]
  selectionMode: boolean // 多选态
  selectedImageList: string[]
  handleSelct: (img: string) => void
}

const ImageGroupByData: React.FC<ImageGroupByDataProps> = ({ date, imageList, selectionMode, selectedImageList, handleSelct }): React.ReactNode => {
  return (
    <Box mb={"1rem"}>
      <SubTitle>{dayjs().isSame(date, "day") ? "Today" : dayjs(date).format("MMMM DD, YYYY")}</SubTitle>
      <Grid templateColumns="repeat(4, 1fr)" gap="3">
        <For each={imageList as string[]}>
          {(item: string, index: number) => (
            <GridItem
              key={item + index}
              position={"relative"}
              onClick={() => {
                handleSelct(item)
              }}
            >
              <Show when={selectionMode}>
                <Show
                  when={selectedImageList.includes(item)}
                  fallback={
                    <Box position={"absolute"} top={"2pt"} right={"2pt"} w={"12pt"} h={"12pt"}>
                      <Image src={unselectedIcon.src} alt="select-icon" />
                    </Box>
                  }
                >
                  <Box position={"absolute"} top={"2pt"} right={"2pt"} w={"12pt"} h={"12pt"}>
                    <Image src={selectedIcon.src} alt="select-icon" />
                  </Box>
                </Show>
              </Show>
              <Image key={item + index} src={item} />
            </GridItem>
          )}
        </For>
      </Grid>
    </Box>
  )
}

const SubTitle = styled.div`
  color: #737373;
  font-weight: 400;
  font-size: 1.2rem;
  padding-bottom: 0.5rem;
`

export default ImageGroupByData
