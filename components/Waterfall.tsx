import React, { useState, useRef, useEffect, Suspense, useCallback } from "react";
import axios from "axios";
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
    margin-left: -15px; /* 调整间距 */
  }

  .my-masonry-grid_column {
    padding-left: 15px; /* 调整间距 */
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
    if (!hasMore || loading) return;
    setLoading(true);

    try {
      const response = await axios.post(
        "https://create.aimoda.tech:3000/api/image/list",
        {
          limit: 10,
          offset: page * 10,
          library: "top_sales",
        },
        {
          headers: { "Content-Type": "text/plain" },
        }
      );
      const newImages = response.data.data;

      setImageList((prev) => [...prev, ...newImages]);
      setHasMore(newImages.length > 0);
      setPage((prev) => prev + 1);
    } catch (err) {
      setError(axios.isAxiosError(err) ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const lastImageRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            fetchData();
          }
        },
        { rootMargin: "200px", threshold: 0.1 }
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
      {/* 全局应用样式 */}
      <Global styles={masonryStyles} />
      <Box>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {imageList.map((item, index) => (
            <Suspense fallback={<div>Loading...</div>} key={item.ID}>
              <Box  key={item.ID}>
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
