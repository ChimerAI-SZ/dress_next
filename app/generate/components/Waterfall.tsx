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

  const openModal = (src: string) => {
    setVisibleImage(src);
    onOpen();
  };

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

  useEffect(() => {
    if (!hasFetchedOnce.current) {
      fetchData(); // 只在第一次进入页面时请求
      hasFetchedOnce.current = true; // 设置为 true，表示已经请求过
    }
  }, [fetchData]);

  useEffect(() => {
    if (containerRef.current) {
      const app = containerRef.current;
      const originTop = app.getBoundingClientRect().top;
      let startP: any, moveLen;
      // 是否执行有效下拉回调标志位
      let refreshStatus = false;

      const pullCallback = () => {
        console.log("callback");
        fetchData(() => {
          app.style["transition"] = "transform 0.4s";
          app.style["transform"] = "translate(0, 0px)";
        });
      };

      const _pullHandler = (moveLen: any) => {
        // 下拉元素距离视口顶部距离
        const top_distance = app.getBoundingClientRect().top;
        // 有效下拉才做处理
        if (top_distance >= 0) {
          // 下拉效果
          if (moveLen > 0 && moveLen < 50) {
            app.style["transform"] = "translate(0, " + moveLen + "px)";
          } else if (moveLen >= 50 && moveLen < 100) {
            // 到刷新标志，下拉阻尼增大
            const _moveLen = 50 + (moveLen - 50) * 0.6;
            app.style["transform"] = "translate(0, " + _moveLen + "px)";
          }

          // 下拉触发
          if (top_distance - originTop < 50) {
            refreshStatus = false;
          } else {
            refreshStatus = true;
          }
        }
      };
      const touchstart = (e: any) => {
        startP = e.touches[0].pageY;
        app.style["transition"] = "transform 0s";
      };
      const touchmove = (e: any) => {
        moveLen = e.touches[0].pageY - startP;
        _pullHandler(moveLen);
      };
      const touchend = () => {
        // 下拉元素距离视口顶部距离
        const top_distance = app.getBoundingClientRect().top;

        // 拖动一定距离之后才会触发
        if (top_distance - originTop > 10) {
          // 当有效下拉发生后动画归位，重置样式
          if (refreshStatus) {
            pullCallback();
          }
        }
      };

      app.addEventListener("touchstart", touchstart);
      app.addEventListener("touchmove", touchmove);
      app.addEventListener("touchend", touchend);

      return () => {
        app.removeEventListener("touchstart", touchstart);
        app.removeEventListener("touchmove", touchmove);
        app.removeEventListener("touchend", touchend);
      };
    }
  }, [containerRef.current]);

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
