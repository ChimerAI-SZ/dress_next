'use client'

import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { Container, Box, For, Grid, GridItem, Image, Icon, Show } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { useSearchParams } from 'next/navigation'

import fullSelectionIcon from '@img/favourites/fullSelection.svg'

import Header from '../components/Header'

import { featchFavouritesData } from '../mock'

const itemList = new Array(20).fill(null).map((_, index) => ({
  id: index,
  collection_id: 1,
  image_url: `https://aimoda-ai.oss-us-east-1.aliyuncs.com/aimoda-homepage-image/Group_7${(index % 3) + 5}.svg`,
  date: `2024-11-0${(index % 3) + 1}T15:25:41.156702734+08:00`
}))

export default function FavouriteItem({ params }: { params: { item: string } }) {
  const searchParams = useSearchParams()
  const favouriteName = searchParams.get('name') ?? ''

  const [selectMode, setSelectMode] = useState(false) // 用于标记是否进入多选状态
  const [selectedImgList, setSelectedImgList] = useState([]) // 多选图片列表

  const handleIconClick = (type: string): void => {
    console.log(type)
  }

  const queryData = async () => {
    try {
      const res = await featchFavouritesData(params.item)
      console.log(res, 'res')
    } catch (err: any) {
      // todo error hanlder
    }
  }

  useEffect(() => {
    queryData()
  }, [])

  return (
    <Container px={'0'} className="favourite-item-container">
      <Header name={decodeURIComponent(favouriteName)} addBtnvisible={false} handleIconClick={handleIconClick} />
      <Box px={'1rem'} position={'relative'}>
        <Icon
          fontSize="2xl"
          position={'absolute'}
          right={'1rem'}
          onClick={() => {
            setSelectMode(!selectMode)
          }}
        >
          <Image src={fullSelectionIcon.src} alt="" />
        </Icon>
        <For each={itemList}>
          {(item, index: number) =>
            item.imgList?.length > 0 && (
              <Box key={item.id + index} mb={'2rem'}>
                <SubTitle>{dayjs().isSame(item.date, 'day') ? 'Today' : dayjs(item.date).format('DD/MM/YYYY')}</SubTitle>
                <Grid templateColumns="repeat(4, 1fr)" gap="3">
                  <For each={item.imgList}>
                    {(item: string, index: number) => (
                      <GridItem position={'relative'}>
                        <Show when={selectMode}>
                          <Show when={selectedImgList.includes(item)}>
                            <Cricle />
                          </Show>
                          <div>My Content</div>
                        </Show>
                        <Image key={item + index} src={item} />
                      </GridItem>
                    )}
                  </For>
                </Grid>
              </Box>
            )
          }
        </For>
      </Box>
    </Container>
  )
}

const SubTitle = styled.div`
  color: #a2a2a2;
  font-weight: 400;
  font-size: 1.2rem;
  padding-bottom: 0.5rem;
`
const Cricle = styled.div`
  width: 1rem;
  height: 1rem;
  border: 1px solid #fff;
  border-radius: 50%;
  background-clip: padding-box;
`
