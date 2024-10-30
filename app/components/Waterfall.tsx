"use client";
import React, { useState, useRef, useEffect, Suspense, useCallback } from "react";
import axios from "../../lib/axios";
import Masonry from "react-masonry-css";
import { Box, Flex, Spinner, useDisclosure } from "@chakra-ui/react";
import ImageOverlay from "./ImageOverlay";
import { css, Global } from "@emotion/react";

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

  const openModal = (src: string) => {
    setVisibleImage(src);
    onOpen();
  };

  const fetchData = useCallback(async () => {
    if (loading || !hasMore) return; // 避免重复请求
    setLoading(true);

    try {
      const response = await axios.post(
        "/api/image/list",
        {
          limit: 10,
          offset: page * 10,
          library: "top_sales",
        },

      );
      const newImages = response.data.data;

      setImageList((prev) => [...prev, ...newImages]);
      setHasMore(newImages.length > 0);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading, page]);

  const hasFetchedOnce = useRef(false);

  useEffect(() => {
    if (!hasFetchedOnce.current) {
      fetchData(); // 只在第一次进入页面时请求
      hasFetchedOnce.current = true; // 设置为 true，表示已经请求过
    }
  }, [fetchData]);
  

  const lastImageRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return; // 如果正在加载或没有更多数据，避免触发

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            fetchData(); // 当最后一张图片进入视口时加载更多
          }
        },
        { rootMargin: "100px", threshold: 0.2 }
      );

      if (node) observer.current.observe(node);
    },
    [fetchData, hasMore, loading]
  );

  const handleImageClick = (src: string) => {
    setVisibleImage(src === visibleImage ? null : src);
  };

  const breakpointColumnsObj = {
    default: 3,
    1100: 3,
    700: 3,
    500: 2,
  };

  return (
    <>
      <Global styles={masonryStyles} />
      <Box>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {imageList.map((item, index) => (
            <Suspense fallback={<div>Loading...</div>} key={item.ID}>
              <Box>
                <ImageOverlay
                  src={item.image_url}
                  openModal={() => openModal(item.image_url)}
                  isVisible={visibleImage === item.image_url}
                  ref={index === imageList.length - 1 ? lastImageRef : null}
                  onClick={() => handleImageClick(item.image_url)}
                />
              </Box>
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

export default Waterfall;
