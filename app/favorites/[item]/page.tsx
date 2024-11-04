'use client'

import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import dayjs from 'dayjs'
import { Container, Box, For, Grid, GridItem, Image, Icon, Show } from '@chakra-ui/react'
import { useSearchParams } from 'next/navigation'

import fullSelectionIcon from '@img/favourites/fullSelection.svg'

import Header from '../components/Header'

import { featchFavouritesData } from '../mock'

type GroupList = {
  [key: string]: string[]
}

export default function FavouriteItem({ params }: { params: { item: string } }) {
  const searchParams = useSearchParams()
  const favouriteName = searchParams.get('name') ?? ''

  const [imgGroupList, setImgGroupList] = useState<GroupList>({})
  const [selectMode, setSelectMode] = useState<boolean>(false) // 用于标记是否进入多选状态
  const [selectedImgList, setSelectedImgList] = useState<string[]>([]) // 多选图片列表

  const handleIconClick = (type: string): void => {
    console.log(type)
  }

  const queryData = async () => {
    try {
      const res = await featchFavouritesData(params.item)
      const { data, success } = res

      // 把图片根据日期进行分栏
      // 日期要从今往前排序
      if (success && data?.length > 0) {
        const groupedByDate = new Map()

        data.forEach(item => {
          const date = item.added_at
          // 如果 Map 中还没有这个日期的键，初始化一个空数组
          if (!groupedByDate.has(date)) {
            groupedByDate.set(date, [])
          }
          // 将当前对象的 url 添加到对应日期的数组中
          groupedByDate.get(date).push(item.image_url)
        })

        console.log(Object.fromEntries(groupedByDate))
        setImgGroupList(Object.fromEntries(groupedByDate))
      }

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
        <For each={Object.entries(imgGroupList)}>
          {([date, urls], index: number): React.ReactNode => {
            return (
              <Box key={date + index} mb={'2rem'}>
                <SubTitle>{dayjs().isSame(date, 'day') ? 'Today' : dayjs(date).format('DD/MM/YYYY')}</SubTitle>
                <Grid templateColumns="repeat(4, 1fr)" gap="3">
                  <For each={urls as string[]}>
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
          }}
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
