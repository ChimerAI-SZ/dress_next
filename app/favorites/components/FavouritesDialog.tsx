'use client'

import { useRef } from 'react'
import { Button } from '@chakra-ui/react'
import { DialogActionTrigger, DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle, DialogTrigger } from '@components/ui/dialog'

import { FavouriteDialogProps } from '@definitions/favourites'

const Header: React.FC<FavouriteDialogProps> = ({ children }) => {
  const ref = useRef<HTMLInputElement>(null)

  return (
    <DialogRoot initialFocusEl={() => ref.current} size="xs" closeOnInteractOutside={false} motionPreset="slide-in-top">
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader borderBottom={'1px solid #ddd'}>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogActionTrigger>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  )
}

export default Header
