'use client'
import { useEffect, useState, useReducer } from 'react'
import dayjs from 'dayjs'
import styled from '@emotion/styled'

import { Container, Box, For, Image, Flex, Show, Text } from '@chakra-ui/react'

import ImageGroupByData from '@components/ImageGroupByDate'

import NoSelect from '@img/generate-result/no-select.svg'
import Selected from '@img/generate-result/selected.svg'
import ModalRight from '@img/generate-result/modal-right.svg'
import ModalBack from '@img/generate-result/modal-back.svg'

import Header from './components/Header'
import { Toaster, toaster } from '@components/Toaster'
import { Alert } from '@components/Alert'

import { FavouriteItem } from '@definitions/favourites'
import { HistoryItem } from '@definitions/history'
import { storage } from '@utils/index'

// 接口 - 收藏夹列表
import { queryCollectionList } from '@lib/request/favourites'
import { queryHistory, addImgToFavourite } from '@lib/request/history'

type GroupList = {
  [key: string]: HistoryItem[]
}

function Page() {
  const [selectionMode, setSelectionMode] = useState<boolean>(false) // 用于标记是否进入多选状态
  // 把图片按日期分组
  const [imgGroupList, setImgGroupList] = useState<GroupList>({})
  // 分组前的图片列表
  const [originImgList, setOriginImgList] = useState<HistoryItem[]>([])

  const [selectedImgList, setSelectedImgList] = useState<number[]>([]) // 多选图片列表
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false)

  const [, forceUpdate] = useReducer(x => x + 1, 0)

  const handleSetSelectMode = (mode: any) => {
    setSelectionMode(mode)

    // 取消之后清空已选图片
    if (!mode) {
      setSelectedImgList([])
    }
  }

  // 选择模式下图片的选择、取消选择事件
  // 通过已选图片列表中是否有这个图片来判断是选择还是取消选择
  const handleImgSelect = (img: number) => {
    if (selectedImgList.includes(img)) {
      setSelectedImgList(selectedImgList.filter(item => item !== img))
    } else {
      selectedImgList.push(img)

      // 如果已经全选了，就要把全选标记上
      if (selectedImgList.length === originImgList.length) {
        setIsAllSelected(true)
      }

      setSelectedImgList(selectedImgList)
    }

    forceUpdate()
  }

  const queryData = async () => {
    try {
      // const res = await featchHistoryData("123")
      const user_id = storage.get('user_id')

      const params = { user_id: +(user_id ? user_id : '0'), start_date: dayjs().subtract(1, 'year').format('YYYY-MM-DD'), end_date: dayjs().format('YYYY-MM-DD') }
      const { message, data, success } = await queryHistory(params)
      // const data = [
      //   {
      //     history_id: 1,
      //     user_id: 3,
      //     task_id: "task_456",
      //     image_url: "https://aimoda-ai.oss-us-east-1.aliyuncs.com/aimoda-homepage-image/AIMODA_small.svg",
      //     created_date: "2024-11-12T11:12:05.873813316+08:00"
      //   },
      //   {
      //     history_id: 2,
      //     user_id: 3,
      //     task_id: "task_456",
      //     image_url: "https://aimoda-ai.oss-us-east-1.aliyuncs.com/aimoda-homepage-image/aa4.svg",
      //     created_date: "2024-11-12T11:12:05.873813316+08:00"
      //   }
      // ]

      // 把图片根据日期进行分栏
      // 日期要从今往前排序
      // if (success && data?.length > 0) {
      if (data?.length > 0) {
        const groupedByDate = new Map()

        data.forEach((item: any) => {
          const date = dayjs(item.created_date).format('YYYY-MM-DD')
          // 如果 Map 中还没有这个日期的键，初始化一个空数组
          if (!groupedByDate.has(date)) {
            groupedByDate.set(date, [])
          }
          // 将当前对象的 url 添加到对应日期的数组中
          groupedByDate.get(date).push(item)
        })

        setOriginImgList(data)
        setImgGroupList(Object.fromEntries(groupedByDate))
      }
    } catch (err: any) {
      // todo error hanlder
    }
  }

  const handleCollect = async () => {
    const user_id = storage.get('user_id')

    if (user_id && selectedImgList.length > 0) {
      const { message, data: collectionList, success } = await queryCollectionList({ user_id: +user_id })

      if (success && collectionList?.length > 0) {
        console.log(collectionList)
        // 虽然没有 is_default 的情况很夸张，但是测试环境真的遇到了！！！
        const defalutCollection = collectionList.find((item: FavouriteItem) => item.is_default) ?? collectionList[0]
        const imgUrls = originImgList.filter(item => selectedImgList.includes(item.history_id)).map(item => item.image_url)
        const params = {
          collection_id: defalutCollection.collection_id,
          image_urls: imgUrls
        }
        const { message, data, success } = await addImgToFavourite(params)

        if (success) {
          toaster.create({
            description: (
              <Flex justifyContent={'space-between'} alignItems={'center'}>
                <Flex alignItems={'center'} gap={'0.56rem'}>
                  <Image src={ModalRight.src} boxSize={'1.38rem'}></Image>
                  <Text fontFamily="PingFangSC, PingFang SC" fontWeight="400" fontSize="0.88rem" color="#171717">
                    Collect in Default
                  </Text>
                </Flex>
                <Flex alignItems={'center'} gap={'0.56rem'}>
                  <Text fontFamily="PingFangSC, PingFang SC" fontWeight="400" fontSize="0.88rem" color="#EE3939">
                    Move to
                  </Text>
                  <Image src={ModalBack.src} boxSize={'1rem'} />
                </Flex>
              </Flex>
            )
          })
        } else {
          Alert.open({
            content: message
          })
        }
      } else {
        Alert.open({
          content: message
        })
      }
    }
  }

  useEffect(() => {
    // fetchCollectionList
    queryData()
  }, [])

  return (
    <Container p={0}>
      <Toaster />
      <Header selectionMode={selectionMode} handleSetSelectMode={handleSetSelectMode} />
      <Box px={'1rem'} position={'relative'}>
        <For each={Object.entries(imgGroupList)}>
          {([date, urls], index: number): React.ReactNode => {
            return <ImageGroupByData key={index} date={date} imageList={urls} selectionMode={selectionMode} selectedImageList={selectedImgList} handleSelect={handleImgSelect} />
          }}
        </For>
      </Box>

      <Show when={selectionMode}>
        <Box p={'8pt 16pt'} position={'fixed'} bottom={0} bgColor={'#fff'} w="100vw" borderRadius={'12px 12px 0 0'} boxShadow={'0px -1px 5px 0px rgba(214, 214, 214, 0.5);'}>
          <Flex alignItems={'center'} justifyContent={'space-between'}>
            <Flex
              gap={'0.53rem'}
              alignItems={'center'}
              onClick={() => {
                if (isAllSelected) {
                  setSelectedImgList([])
                } else {
                  setSelectedImgList(originImgList.map(item => item.history_id))
                }
                setIsAllSelected(!isAllSelected)
              }}
            >
              <Image boxSize="16pt" src={isAllSelected ? Selected.src : NoSelect.src} border="0.06rem solid #BFBFBF" backdropFilter="blur(50px)" borderRadius={'50%'}></Image>
              <Text>Select all</Text>
            </Flex>
            <Flex alignItems={'center'} justifyContent={'flex-start'}>
              <StyledImage selectedImgList={selectedImgList} src={'/assets/images/favourites/download.svg'} alt="download-icon" />
              <StyledImage selectedImgList={selectedImgList} onClick={handleCollect} src={'/assets/images/favourites/unliked.svg'} alt="liked-icon" />
              <StyledImage selectedImgList={selectedImgList} src={'/assets/images/favourites/buy.svg'} alt="buy-icon" />
            </Flex>
          </Flex>
        </Box>
      </Show>
    </Container>
  )
}

interface StyledImageProps {
  selectedImgList: number[]
}
const StyledImage = styled(Image)<StyledImageProps>`
  width: 28pt;
  height: 28pt;
  margin: 0 8pt;

  opacity: ${props => (props.selectedImgList.length <= 0 ? '0.4' : 'unset')};
  transition: opacity 0.5s ease;
`

export default Page
