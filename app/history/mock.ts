import defaultPng from "@img/index-1.png"

interface FavouriteItemImage {
  id: number
  collection_id: number
  image_url: string
  is_deleted: boolean
  added_at: string
}
type FavouriteImage = {
  message: string
  success: boolean
  data: FavouriteItemImage[]
}

export function featchHistoryData(id: string): Promise<FavouriteImage> {
  console.log(id)

  return new Promise(resolve =>
    setTimeout(
      () =>
        resolve({
          data: new Array(20).fill(null).map((_, index) => ({
            id: index,
            collection_id: 1,
            image_url: defaultPng.src,
            // image_url: `https://aimoda-ai.oss-us-east-1.aliyuncs.com/aimoda-homepage-image/Group_7${(index % 3) + 5}.svg`,
            added_at: `2024-11-0${(index % 3) + 1}T15:25:41.156702734+08:00`,
            is_deleted: false
          })),
          message: "",
          success: true
        }),
      1000
    )
  )
}
