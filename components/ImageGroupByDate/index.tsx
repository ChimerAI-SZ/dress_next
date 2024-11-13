import styled from "@emotion/styled"
import dayjs from "dayjs"
import { Box, For, Grid, GridItem, Image, Show } from "@chakra-ui/react"

import selectedIcon from "@img/favourites/selectedIcon.svg"
import unselectedIcon from "@img/favourites/unselectedIcon.svg"

import { HistoryItem } from "@definitions/history"

interface ImageGroupByDataProps {
  date: string
  imageList: HistoryItem[]
  selectionMode: boolean // 多选态
  selectedImageList: number[]
  handleSelect: (img: number) => void
}

const ImageGroupByData: React.FC<ImageGroupByDataProps> = ({ date, imageList, selectionMode, selectedImageList, handleSelect }): React.ReactNode => {
  return (
    <Box mb={"1rem"}>
      <SubTitle>{dayjs().isSame(date, "day") ? "Today" : dayjs(date).format("MMMM DD, YYYY")}</SubTitle>
      <Grid templateColumns="repeat(4, 1fr)" gap="3">
        <For each={imageList as HistoryItem[]}>
          {(item: HistoryItem, index: number) => (
            <GridItem
              key={item.history_id + index}
              position={"relative"}
              onClick={() => {
                handleSelect(item.history_id)
              }}
            >
              <Show when={selectionMode}>
                <Show
                  when={selectedImageList.includes(item.history_id)}
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
              <Image key={item.history_id + index} src={item.image_url} />
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
  font-size: 1rem;
  padding-bottom: 0.5rem;
`

export default ImageGroupByData
