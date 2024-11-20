/**!SECTION
 * 新增/编辑收藏夹信息
 */
"use client"

import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"

import { Button, Fieldset, Input, Text, Textarea, Box, VStack } from "@chakra-ui/react"
import { InputGroup } from "@components/ui/input-group"
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger
} from "@components/ui/drawer"
import { Field } from "@components/ui/field"
import { CloseOutlined } from "@ant-design/icons"

import { storage } from "@utils/index"

import { FavouriteDialogProps } from "@definitions/favourites"

import { addNewCollection, upadteCollection } from "@lib/request/favourites" // 接口 - 新建收藏夹

interface FormValues {
  title: string
  description: string
}

const AlbumDrawer: React.FC<FavouriteDialogProps> = ({ type, collectionId, visible, close, onSuccess }) => {
  const collectionList = useSelector((state: any) => state.collectionList.value)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      title: collectionId ? (collectionList.find((item: any) => item.collection_id === collectionId)?.title ?? "") : "",
      description: collectionId
        ? (collectionList.find((item: any) => item.collection_id === collectionId)?.description ?? "")
        : ""
    }
  })

  // 表单最终提交逻辑
  const onSubmit = async (formData: FormValues) => {
    const user_id = storage.get("user_id")

    if (user_id) {
      if (type === "add") {
        const params = {
          user_id: +user_id as number,
          title: formData.title,
          description: formData.description ?? ""
        }
        const { message, data, success } = await addNewCollection(params)

        if (success) {
          close && close()
          onSuccess && onSuccess(data)
        }
      } else {
        const params = {
          user_id: +user_id as number,
          title: formData.title,
          description: formData.description ?? "",
          collection_id: collectionId ?? 0
        }
        const { success } = await upadteCollection(params)

        if (success) {
          close && close()
          onSuccess && onSuccess(formData)
        }
      }
    }
  }

  return (
    <DrawerRoot placement="bottom" open={visible}>
      <DrawerBackdrop />
      <DrawerContent borderRadius={"24px 24px 0 0"} overflow={"hidden"}>
        <DrawerHeader py={"9pt"} height={"44pt"} position={"relative"}>
          <DrawerTitle display={"flex"} position={"relative"} justifyContent={"center"} alignItems={"center"}>
            <DrawerTrigger asChild>
              <Box position="absolute" left="0">
                <CloseOutlined onClick={close} />
              </Box>
            </DrawerTrigger>
            {type === "add" ? "Add New" : "Edit"} Album
          </DrawerTitle>
        </DrawerHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DrawerBody>
            <VStack pb="4rem" w="100%">
              <Fieldset.Root w="100%">
                <Fieldset.Content w="100%">
                  {/* Titile */}
                  <Field label="Title" fontSize="0.75rem" fontWeight="400" invalid={!!errors.title}>
                    <InputGroup w="100%" bg={!!errors.title ? "#ffe0e0" : ""}>
                      <Input
                        {...register("title", {
                          required: "title is required"
                        })}
                        flex="1"
                        name="title"
                        // placeholder="Type your title"
                        _focusVisible={{
                          borderColor: "#404040",
                          boxShadow: "none",
                          outlineStyle: "none"
                        }}
                      />
                    </InputGroup>
                    {errors.title && (
                      <Text color="red.500" fontSize="0.75rem">
                        {errors.title.message}
                      </Text>
                    )}
                  </Field>
                  {/* Description */}
                  <Field label="Description" fontSize="0.75rem" fontWeight="400" invalid={!!errors.description}>
                    <InputGroup w="100%" bg={!!errors.description ? "#ffe0e0" : ""}>
                      <Textarea
                        {...register("description", {})}
                        flex="1"
                        name="description"
                        _focusVisible={{
                          borderColor: "#404040",
                          boxShadow: "none",
                          outlineStyle: "none"
                        }}
                      />
                    </InputGroup>
                  </Field>
                </Fieldset.Content>
              </Fieldset.Root>
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <Button w={"100%"} bgColor={"#ee3939"} borderRadius={"40px"} type="submit">
              Done
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </DrawerRoot>
  )
}

export default AlbumDrawer
