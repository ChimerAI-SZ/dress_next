"use client"

import { Box, Flex, Text, Image, Button } from "@chakra-ui/react"
import { CollectionSelectorProps } from "@definitions/generate"
import { CheckboxGroup, Fieldset } from "@chakra-ui/react"
import { Checkbox } from "@components/ui/checkbox"
import Toast from "@components/Toast"
import { images } from "@constants/images"
import { AlbumItem } from "@definitions/album"
import { useState, useEffect } from "react"

export default function CollectionSelector({
  visible,
  collections,
  selectedCollections,
  onSelect,
  onClose,
  onAddNew
}: CollectionSelectorProps): JSX.Element | null {
  const [tempSelected, setTempSelected] = useState<string[]>(selectedCollections)

  useEffect(() => {
    if (visible) {
      setTempSelected([])
    }
  }, [visible])

  if (!visible) return null

  const handleDone = () => {
    onSelect(tempSelected)
  }

  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      setTempSelected([value])
    } else {
      setTempSelected([])
    }
  }

  return (
    <>
      {visible && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(17,17,17,0.5)"
          zIndex={9998}
          onClick={onClose}
        />
      )}
      <Box
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        bg="white"
        transform={visible ? "translateY(0)" : "translateY(100%)"}
        transition="transform 0.3s"
        zIndex={9999}
        borderTopRadius="1rem"
        boxShadow="0 -4px 12px rgba(0, 0, 0, 0.1)"
      >
        <Flex alignItems="center" justifyContent="space-between" my="0.87rem" mx="1.05rem" zIndex={10000}>
          <Flex
            onClick={onClose}
            boxSize="22pt"
            alignItems="center"
            justifyContent="center"
            fontSize="1.5rem"
            borderRadius="50%"
          >
            <Image src={images.close} boxSize="1.6rem" />
          </Flex>
          <Text fontSize="1.06rem" fontWeight="500" color="#171717">
            Select Albums
          </Text>
          <Flex
            onClick={onAddNew}
            width="4.06rem"
            alignItems="center"
            justifyContent="center"
            fontSize="1.5rem"
            border="0.03rem solid #BFBFBF"
            borderRadius="1rem"
            cursor="pointer"
            height="1.75rem"
            gap={"0.25rem"}
          >
            <Image src={images.addIcon} boxSize="0.88rem" alt="add icon" />
            <Text fontWeight="500" fontSize="0.81rem" color="#404040" textAlign="center" fontStyle="normal">
              New
            </Text>
          </Flex>
        </Flex>

        <Fieldset.Root flexGrow={1} maxH="30vh" minH="20vh" overflow="auto" mx="1.05rem">
          <Box>
            <Fieldset.Content>
              {collections.map((item: AlbumItem) => (
                <Box key={item.collection_id}>
                  <input
                    type="radio"
                    id={item.collection_id.toString()}
                    name="collection"
                    value={item.collection_id.toString()}
                    checked={tempSelected.includes(item.collection_id.toString())}
                    onChange={e => handleCheckboxChange(e.target.value, e.target.checked)}
                    style={{ display: "none" }}
                  />
                  <label
                    htmlFor={item.collection_id.toString()}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "0.5rem 0",
                      cursor: "pointer"
                    }}
                  >
                    {tempSelected.includes(item.collection_id.toString()) ? (
                      <Image marginRight="8px" src={images.selected} boxSize="1.25rem" alt="selected" />
                    ) : (
                      <Box
                        boxSize="1.25rem"
                        borderRadius="50%"
                        border="1px solid #BFBFBF"
                        marginRight="8px"
                        backgroundColor={"white"}
                      />
                    )}
                    <Text>{item.title}</Text>
                  </label>
                </Box>
              ))}
            </Fieldset.Content>
          </Box>
        </Fieldset.Root>

        <Flex
          mb={"0.63rem"}
          alignItems="center"
          justifyContent="center"
          mt="16pt"
          alignSelf="center"
          w="100%"
          m={"0 auto"}
        >
          <Button
            w="20.38rem"
            bgColor="#ee3939"
            borderRadius="1.25rem"
            onClick={handleDone}
            disabled={tempSelected.length === 0}
            mb={"1.8rem"}
          >
            Done
          </Button>
        </Flex>
      </Box>
    </>
  )
}
