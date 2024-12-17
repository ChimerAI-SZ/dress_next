import { Image, Flex, Text, For, Show } from "@chakra-ui/react"
import styled from "@emotion/styled"

interface DetailItem {
  label: string
  value: string | string[]
  img: string
}

interface DetailsProps {
  detailList: DetailItem[]
  footerHeight: number
}

const Details: React.FC<DetailsProps> = ({ detailList, footerHeight }) => {
  return (
    <>
      <DetailsWrapper>
        <For each={detailList}>
          {detail => (
            <Detail key={detail.label}>
              <Flex alignItems="center" justifyContent="flex-start" mb={"0.47rem"}>
                <Image boxSize="1.44rem" src={detail.img} mr={"0.25rem"} />
                <Text color="#171717" fontWeight="400" fontSize="0.75rem">
                  {detail.label}
                </Text>
              </Flex>
              <Flex alignItems="flex-start" flexFlow="row wrap">
                <Show
                  when={Array.isArray(detail.value) && detail.value.length > 0}
                  fallback={
                    <Text
                      fontSize="0.75rem"
                      color="#171717"
                      fontWeight="400"
                      lineHeight={"1.13rem"}
                      textAlign={"justify"}
                    >
                      {detail.value}
                    </Text>
                  }
                >
                  <For each={detail.value as string[]}>
                    {item => (
                      <DetailItem>
                        <Text fontSize="0.75rem" fontWeight="400" color="#ee3939">
                          {item}
                        </Text>
                      </DetailItem>
                    )}
                  </For>
                </Show>
              </Flex>
            </Detail>
          )}
        </For>
      </DetailsWrapper>
      <PlaceHolder height={footerHeight} />
    </>
  )
}

const DetailsWrapper = styled.section`
  z-index: 1;
  padding: 0 1.5rem;
`

const Detail = styled.div`
  margin-bottom: 1.25rem;
`

const DetailItem = styled.div`
  background: #ffffff;
  border-radius: 1.11rem;
  border: 0.03rem solid #ee3939;
  padding: 0 0.63rem;
  margin-right: 0.75rem;
  margin-bottom: 0.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`

interface PlaceHolderType {
  height: number
}

const PlaceHolder = styled.div<PlaceHolderType>`
  margin-top: ${props => props.height + 16 + "px"};
  flex-shrink: 0;
`

export default Details
