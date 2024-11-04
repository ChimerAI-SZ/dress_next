import React, { useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  Text,
  Grid,
  GridItem,
  Image,
  Circle,
} from "@chakra-ui/react";

const fetchGalleryImages = () => {
  // Simulate an async request to fetch images
  return new Promise<string[]>((resolve) => {
    setTimeout(() => {
      resolve([
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg",
        "https://example.com/image3.jpg",
        "https://example.com/image4.jpg",
        "https://example.com/image5.jpg",
      ]);
    }, 1000);
  });
};

const PatternSelector = () => {
  const [patterns, setPatterns] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  const handleAddClick = async () => {
    const images = await fetchGalleryImages();
    // Replace the first slot (previously the "Add" button) with the first fetched image
    setPatterns((prevPatterns) => {
      const updatedPatterns = [...prevPatterns];
      updatedPatterns[0] = images[0]; // Assign the first image to the first slot
      return updatedPatterns;
    });
  };

  return (
    <Box
      w="full"
      maxW="400px"
      p={4}
      bg="white"
      borderRadius="md"
      boxShadow="md"
    >
      <Grid templateColumns="repeat(4, 1fr)" gap={2}>
        {patterns.map((pattern, index) => (
          <GridItem key={index} position="relative">
            {pattern ? (
              <Box
                w="full"
                h="full"
                bgImage={`url(${pattern})`}
                bgSize="cover"
                borderRadius="md"
                overflow="hidden"
                position="relative"
              >
                {/* Close button to remove image */}
                <IconButton
                  aria-label="Remove"
                  size="xs"
                  position="absolute"
                  top="2"
                  right="2"
                  colorScheme="red"
                  onClick={() => {
                    setPatterns((prevPatterns) => {
                      const updatedPatterns = [...prevPatterns];
                      updatedPatterns[index] = null;
                      return updatedPatterns;
                    });
                  }}
                />
              </Box>
            ) : (
              // Show "Add" button if no image is in the slot
              <Flex
                align="center"
                justify="center"
                w="full"
                h="full"
                bg="gray.100"
                borderRadius="md"
                cursor="pointer"
                onClick={index === 0 ? handleAddClick : undefined} // Only first slot has Add button functionality
              ></Flex>
            )}
          </GridItem>
        ))}
      </Grid>

      {/* Pagination dots */}
      <Flex mt={4} justify="center">
        {[...Array(4)].map((_, i) => (
          <Circle
            key={i}
            size="8px"
            bg={i === 0 ? "red.500" : "gray.300"}
            mx="2px"
          />
        ))}
      </Flex>
    </Box>
  );
};

export default PatternSelector;
