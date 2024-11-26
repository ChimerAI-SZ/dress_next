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
    <Toast
      close={onClose}
      maskVisible={false}
      boxStyle={{
        boxShadow: "0px 2px 8px 0px rgba(17,17,17,0.12)",
        borderRadius: "16px 16px 0 0",
        width: "100vw",
        bottom: "0",
        left: "0",
        right: "0",
        top: "unset",
        transform: "unset",
        padding: "12pt",
        pt: "0",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Flex alignItems="center" justifyContent="space-between" my="8pt">
        <Flex
          onClick={onClose}
          boxSize="22pt"
          alignItems="center"
          justifyContent="center"
          fontSize="1.5rem"
          borderRadius="50%"
        >
          <Image src="/assets/images/album/closeIcon.svg" boxSize="14pt" />
        </Flex>
        <Text fontSize="1.06rem" fontWeight="500" color="#171717">
          Select Albums
        </Text>
        <Flex
          onClick={onAddNew}
          boxSize="20pt"
          alignItems="center"
          justifyContent="center"
          fontSize="1.5rem"
          borderRadius="50%"
          border="1px solid #BFBFBF"
        >
          <Image src={images.addIcon} boxSize="14pt" alt="add icon" />
        </Flex>
      </Flex>

      <Fieldset.Root flexGrow={1} maxH="30vh" minH="20vh" overflow="auto">
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
                    padding: "8px",
                    cursor: "pointer"
                  }}
                >
                  <Box
                    width="20px"
                    height="20px"
                    borderRadius="50%"
                    border="1px solid #BFBFBF"
                    marginRight="8px"
                    backgroundColor={tempSelected.includes(item.collection_id.toString()) ? "#ee3939" : "white"}
                  />
                  <Text>{item.title}</Text>
                </label>
              </Box>
            ))}
          </Fieldset.Content>
        </Box>
      </Fieldset.Root>

      <Box mt="16pt">
        <Button
          w="100%"
          bgColor="#ee3939"
          borderRadius="40px"
          onClick={handleDone}
          disabled={tempSelected.length === 0}
        >
          Done
        </Button>
      </Box>
    </Toast>
  )
}
