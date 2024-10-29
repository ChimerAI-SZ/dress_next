import {
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    Button,
    Image,
    Box,
    Text,
    Stack,
    Flex,
    Spinner,
    Input,
  } from "@chakra-ui/react";
  import { useEffect, useRef, useState } from "react";
  import Index1 from "/assets/images/index-1.png";
  import Index2 from "/assets/images/index-2.png";
  import Index3 from "/assets/images/index-3.png";
  import Index4 from "/assets/images/index-4.png";
  import Index5 from "/assets/images/index-5.png";
  import Index6 from "/assets/images/index-6.png";
  import useAliyunOssUpload from "../hooks/useAliyunOssUpload";
  
  interface ImageGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
  }
  
  const ImageGuideModal: React.FC<ImageGuideModalProps> = ({ isOpen, onClose }) => {
    const { uploadToOss, uploadedUrl } = useAliyunOssUpload();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState(false);
  
    const handleNavigate = () => {
      fileInputRef.current?.click();
    };
  
    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      setLoading(true);
      if (file) {
        await uploadToOss(file);
      }
    };
  
    useEffect(() => {
      if (uploadedUrl) {
        setLoading(false);
        onClose();
      }
    }, [uploadedUrl, onClose]);
  
    return (
      <DialogRoot open={isOpen} onOpenChange={onClose}>
        <DialogContent mx={4} borderRadius="0px">
          <DialogHeader>
            <Flex position="relative" alignItems="center" justifyContent="center">
              <DialogCloseTrigger asChild>
                <Button
                  position="absolute"
                  left="1rem"
                  fontSize="1.5rem"
                  fontWeight="normal"
                  variant="ghost"
                >
                  ×
                </Button>
              </DialogCloseTrigger>
              <DialogTitle>Image Guide</DialogTitle>
            </Flex>
          </DialogHeader>
  
          <DialogBody px={4} mt="-0.9rem">
            <Text mb={4} color="gray" fontSize="0.8rem" fontWeight="400">
              In order to have a better generative result, please upload a full display of the dress, as shown below:
            </Text>
            <Stack spacing={4} align="stretch" h="40vh" overflowY="auto">
              <Box>
                <Text mb={2} fontSize="0.8rem" fontWeight="400">Outfit</Text>
                <Box columnGap="16px" display="grid" gridTemplateColumns="repeat(2, 1fr)">
                  <Image src="/assets/images/index-1.png" alt="Correct Outfit" borderRadius="0px" />
                  <Image src="/assets/images/index-1.png" alt="Correct Outfit" borderRadius="0px" />
                </Box>
              </Box>
              <Box>
                <Text mb={2} fontSize="0.8rem" fontWeight="400">Print</Text>
                <Box columnGap="16px" display="grid" gridTemplateColumns="repeat(2, 1fr)">
                  <Image src="/assets/images/index-1.png" alt="Correct Outfit" borderRadius="0px" />
                  <Image src="/assets/images/index-1.png" alt="Correct Outfit" borderRadius="0px" />
                </Box>
              </Box>
              <Box>
                <Text mb={2} fontSize="0.8rem" fontWeight="400">Fabric</Text>
                <Box columnGap="16px" display="grid" gridTemplateColumns="repeat(2, 1fr)">
                  <Image src="/assets/images/index-1.png" alt="Correct Outfit" borderRadius="0px" />
                  <Image src="/assets/images/index-1.png" alt="Correct Outfit" borderRadius="0px" />
                </Box>
              </Box>
            </Stack>
          </DialogBody>
  
          <DialogFooter px={4}>
            <Button
              colorScheme="blackAlpha"
              width="full"
              bg="black"
              onClick={handleNavigate}
              py="1.7rem"
              borderRadius="4px"
            //   rightIcon={loading ? <Spinner size="sm" color="white" /> : undefined}
            >
              {loading ? "Uploading..." : "Got it"}
            </Button>
          </DialogFooter>
        </DialogContent>
        <Input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          display="none"
          onChange={handleImageChange}
        />
      </DialogRoot>
    );
  };
  
  export default ImageGuideModal;
  