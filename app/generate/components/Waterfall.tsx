"use client";
import React, {
  useState,
  useRef,
  useEffect,
  Suspense,
  useCallback,
} from "react";
import Masonry from "react-masonry-css";
import { Box, Flex, Spinner, useDisclosure, Image } from "@chakra-ui/react";
import { css, Global, keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { fetchHomePage } from "@lib/request/page";
import { errorCaptureRes } from "@utils/index";

import loadingIcon from "@img/mainPage/loading.svg";
interface Item {
  image_url: string;
  ID: number;
  url: string;
}

const masonryStyles = css`
  .my-masonry-grid {
    display: flex;
    width: auto;
    margin-left: -15px;
  }

  .my-masonry-grid_column {
    padding-left: 15px;
    background-clip: padding-box;
  }
`;

const breakpointColumnsObj = {
  default: 3,
  1100: 3,
  700: 3,
  500: 2,
};

const Waterfall: React.FC = () => {
  const [visibleImage, setVisibleImage] = useState<string | null>(null);
  const [imageList, setImageList] = useState<Item[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const loaderRef = useRef(null);
  const { onOpen } = useDisclosure();
  const observer = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(
    async (callback?: () => void) => {
      if (loading || !hasMore) return; // 避免重复请求
      setLoading(true);
      const [err, res] = await errorCaptureRes(fetchHomePage, {
        limit: 10,
        offset: page * 10,
        library: "top_sales",
      });

      if (res) {
        const newImages = res?.data;
        console.log(newImages);
        setImageList((prev) => [...prev, ...newImages]);
        setHasMore(newImages.length > 0);
        setPage((prev) => prev + 1);

        callback && callback();
      }
      setLoading(false);
    },
    [hasMore, page]
  );

  const hasFetchedOnce = useRef(false);

  useEffect(() => {
    if (!hasFetchedOnce.current) {
      fetchData(); // 只在第一次进入页面时请求
      hasFetchedOnce.current = true; // 设置为 true，表示已经请求过
    }
  }, [fetchData]);

  return (
    <>
      <Global styles={masonryStyles} />
      <Box ref={containerRef} position={"relative"}>
        <Box
          className="main-page-hidden-loading-icon"
          position={"absolute"}
          top={"-40pt"}
          left={"50%"}
          transform={"translateX(-50%)"}
        >
          <StyledLoading
            src={loadingIcon.src}
            alt="loading-icon"
            boxSize="24pt"
          />
        </Box>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {imageList.map((item, index) => (
            <Suspense fallback={<div>Loading...</div>} key={item.ID}>
              <Image
                src={item.image_url}
                alt="Displayed Image"
                width="100%"
                style={{ display: "block" }}
                borderRadius="4px"
              />
            </Suspense>
          ))}
        </Masonry>
        <Box ref={loaderRef} mt={4}>
          {loading && (
            <Flex justify="center" align="center">
              <Spinner size="lg" />
            </Flex>
          )}
        </Box>
      </Box>
    </>
  );
};

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;
const StyledLoading = styled(Image)`
  animation: ${spin} 2s linear infinite; /* 旋转动画持续2秒，线性变化，无限循环 */
`;

export default Waterfall;
