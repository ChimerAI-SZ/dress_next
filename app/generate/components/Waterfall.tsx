import React, {
  useState,
  useRef,
  useEffect,
  Suspense,
  SetStateAction,
  useCallback,
} from "react";
import axios from "axios";
import Masonry from "react-masonry-css";
import { Box, Image, Flex, Spinner, Alert } from "@chakra-ui/react";
import { fetchHomePage } from "@lib/request/page";
import { errorCaptureRes } from "@utils/index";
interface Item {
  image_url: string;
  ID: number;
  url: string;
}
import { css, Global, keyframes } from "@emotion/react";
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

const Waterfall = () => {
  const [visibleImage, setVisibleImage] = useState<string | null>(null);
  const hasFetched = useRef(false);
  const [imageList, setImageList] = useState<Item[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const loaderRef = useRef(null);
  const [selectedSrc, setSelectedSrc] = useState("");
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchData = useCallback(
    async (callback?: () => void) => {
      if (loading || !hasMore) return; // 避免重复请求
      setLoading(true);
      const [err, res] = await errorCaptureRes(fetchHomePage, {
        limit: 10,
        offset: page * 10,
        library: "show",
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

  useEffect(() => {
    if (!hasFetched.current) {
      fetchData(); // 只在第一次进入页面时请求
      hasFetched.current = true; // 设置为 true，表示已经请求过
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchData(); // 只在元素进入视口时调用 fetchData
      }
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current); // 观察 loader 元素
    }

    return () => observer.disconnect(); // 清除观察器
  }, [fetchData]);

  const breakpointColumnsObj = {
    default: 3,
    1100: 3,
    700: 3,
    500: 2,
  };
  // 使用 useCallback 保持 observer 的稳定性
  const lastImageRef = useCallback(
    (node: any) => {
      if (loading) return; // 如果正在加载，避免重复请求
      if (observer.current) observer.current.disconnect(); // 断开之前的 observer

      // 绑定新的 IntersectionObserver
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            fetchData(); // 当最后一张图片进入视口时加载更多
          }
        },
        {
          root: null, // 默认为视口
          rootMargin: "10px", // 提前 10px 触发懒加载
          threshold: 0.1, // 目标元素进入视口 10% 时触发
        }
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchData]
  );

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
            <Suspense
              fallback={<div>Loading...</div>}
              key={`${item.ID}-${index}`}
            >
              <Image
                src={item.image_url}
                alt="Displayed Image"
                width="100%"
                style={{ display: "block" }}
                borderRadius="4px"
                ref={index === imageList.length - 1 ? lastImageRef : null}
                mb="16px"
              />
            </Suspense>
          ))}
        </Masonry>
        <Box>
          {loading && (
            <Flex justify="center" align="center" mt={4}>
              <Spinner size="lg" />
            </Flex>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Waterfall;
