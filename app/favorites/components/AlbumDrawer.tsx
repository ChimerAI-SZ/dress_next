"use client"

import { Button, Fieldset, Input, Textarea, Box } from "@chakra-ui/react"
import { DrawerBackdrop, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, DrawerRoot, DrawerTitle, DrawerTrigger } from "@components/ui/drawer"
import { Field } from "@components/ui/field"
import { FavouriteDialogProps } from "@definitions/favourites"
import { CloseOutlined } from "@ant-design/icons"

const AlbumDrawer: React.FC<FavouriteDialogProps> = ({ children, type, favouriteId }) => {
  return (
    <DrawerRoot placement="bottom">
      <DrawerBackdrop />
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent borderRadius={"24px 24px 0 0"} overflow={"hidden"}>
        <DrawerHeader py={"9pt"} height={"44pt"} position={"relative"}>
          <DrawerTitle display={"flex"} position={"relative"} justifyContent={"center"} alignItems={"center"}>
            <DrawerTrigger asChild>
              <Box position="absolute" left="0">
                <CloseOutlined />
              </Box>
            </DrawerTrigger>
            {type === "add" ? "Add" : "Edit"} New Album
          </DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <Fieldset.Root w="100%">
            <Fieldset.Content w="100%">
              <Field label="Title">
                <Input bgColor={"#f5f5f5"} name="title" />
              </Field>
              <Field label="Description">
                <Textarea bgColor={"#f5f5f5"} name="description" placeholder="Provide some descriptions of new album" />
              </Field>
            </Fieldset.Content>
          </Fieldset.Root>
        </DrawerBody>
        <DrawerFooter>
          <Button w={"100%"} bgColor={"#ee3939"} borderRadius={"40px"}>
            Done
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </DrawerRoot>
  )
}

export default AlbumDrawer
