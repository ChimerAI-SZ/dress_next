
import React, { forwardRef } from "react";
import { Box, Image, Button } from "@chakra-ui/react";
import ArrowRight from "/assets/images/arrow-right.svg";

interface ImageOverlayProps {
  src: string;
  isVisible: boolean;
  onClick: () => void;
  openModal: (src: string) => void;
}

// 使用 forwardRef 来接收传递的 ref
const ImageOverlay = forwardRef<HTMLDivElement, ImageOverlayProps>(
  ({ src, isVisible, onClick, openModal }, ref) => {
    const thumbnailUrl = `${src}/resize,w_200`;
    // console.log('thumbnailUrl',thumbnailUrl);
    return (
      <Box ref={ref} position="relative" width="100%" mb="16px">
        <Image
          src={thumbnailUrl}
          alt="Displayed Image"
          onClick={onClick}
          width="100%"
          style={{ display: "block" }}
          borderRadius="4px"
        />
        {isVisible && (
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="rgba(0, 0, 0, 0.5)"
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            borderRadius="4px"
            p={3}
            onClick={onClick} 
          >
            <Button
              onClick={() => {
                // navigate({
                //   to: "/generate",
                //   search: {
                //     condition: "1",
                //     thumbnail: src || "",
                //   },
                // });
              }}
              bg="black"
              color="white"
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="full"
              pb={1}
              borderRadius="4px"
            //   rightIcon={
            //     <Image
            //       src={ArrowRight}
            //       alt="Profile"
            //       boxSize="1.2rem"
            //       cursor="pointer"
            //       mt="0.2rem"
            //       ml="0.01rem"
            //       borderRadius="4px"
            //     />
            //   }
            >
              Generate
            </Button>
          </Box>
        )}
      </Box>
    );
  }
);

ImageOverlay.displayName = "ImageOverlay";

export default ImageOverlay;
