"use client";

import {
  Container,
  Box,
  Flex,
  Link,
  Image,
  Button,
  Text,
  useDisclosure,
} from "@chakra-ui/react";


import Waterfall from "./components/Waterfall";
// import ImageGuideModal from "../components/Common/ImageGuideModal";

function Dashboard() {
  const { onOpen, onClose } = useDisclosure();

  return (
    <Container maxW="container.lg" p={3}>
      {/* Header Section */}
      <Flex
        as="header"
        justify="space-between"
        align="center"
        mb={4}
        position="sticky"
        top={0}
        bg="white"
        zIndex="100"
        mt="-0.2rem"
      >
        <Text
          fontSize="1.3rem"
          fontWeight="bold"
          letterSpacing="0.1rem"
          fontFamily="Arial"
          textAlign="center"
        >
          AIMODA
        </Text>

        <Flex gap="0.8rem">
          <Link href="/history">
            <Image src="/assets/images/history.svg" alt="History" boxSize="2.1rem" cursor="pointer" />
          </Link>
          <Link href="/favorites">
            <Image src="/assets/images/like.svg" alt="Favorites" boxSize="2.1rem" cursor="pointer" />
          </Link>
          <Link href="/profile">
            <Image src="/assets/images/people.svg" alt="Profile" boxSize="2.1rem" cursor="pointer" />
          </Link>
        </Flex>
      </Flex>

      {/* Upload Button */}
      <Button
        width="full"
        colorScheme="blackAlpha"
        bg="black"
        color="white"
        py="1.75rem"
        fontSize="1rem"
        letterSpacing="0.02rem"
        onClick={onOpen}
        mt={1}
        mb={4}
        borderRadius="4px"
        // rightIcon={<Image src={frameIcon} alt="Upload Icon" boxSize="1.5rem" ml="0.01rem" />}
      >
        UPLOAD INSPIRATION
      </Button>

      {/* Subtitle */}
      <Text fontSize="1.0rem" mb={1} letterSpacing="-0.02rem">
        Printed Dress
      </Text>

      {/* Waterfall Content */}
      <Box overflowY="auto" maxH="calc(100vh - 185px)">
        <Waterfall />
      </Box>

      {/* Image Guide Modal */}
      {/* <ImageGuideModal isOpen={isOpen} onClose={onClose} /> */}
    </Container>
  );
}

export default Dashboard;
