import { Portal, Container, Box } from '@chakra-ui/react'

const Toast = ({ children }: { children: React.ReactNode }) => {
  return (
    <Portal>
      <Container p={0} w={'100vw'} h={'100vh'} position={'fixed'} top={0} display={'flex'} zIndex={1400} alignItems={'flex-end'} className="public-toast-container">
        <Box className="public-toast-mask" bgColor="rgba(0, 0, 0, .5)" position={'fixed'} top={0} right={0} left={0} bottom={0}>
          <Box bg={'#fff'} position={'absolute'} top={'50%'} left={'50%'} transform={'translate(-50%, -50%)'}>
            {children}
          </Box>
        </Box>
      </Container>
    </Portal>
  )
}

export default Toast
