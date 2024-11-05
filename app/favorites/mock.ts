import { FavouriteItem, FavouriteImage } from '@definitions/favourites'
import defaultPng from '@img/index-1.png'

export function featchFavouritesList(): Promise<FavouriteItem[]> {
  return new Promise(resolve =>
    setTimeout(
      () =>
        resolve([
          {
            id: '0',
            isDefault: true,
            name: 'Default',
            coverImg: [
              'https://aimoda-ai.oss-us-east-1.aliyuncs.com/aimoda-homepage-image/Group_77.svg',
              'https://aimoda-ai.oss-us-east-1.aliyuncs.com/aimoda-homepage-image/Group_76.svg',
              'https://aimoda-ai.oss-us-east-1.aliyuncs.com/aimoda-homepage-image/Group_75.svg'
            ],
            imgNumber: 126
          },
          {
            id: '1',
            isDefault: false,
            name: 'My Style - 1',
            coverImg: [
              'https://aimoda-ai.oss-us-east-1.aliyuncs.com/aimoda-homepage-image/Group_77.svg',
              'https://aimoda-ai.oss-us-east-1.aliyuncs.com/aimoda-homepage-image/Group_76.svg',
              'https://aimoda-ai.oss-us-east-1.aliyuncs.com/aimoda-homepage-image/Group_75.svg'
            ],
            imgNumber: 34
          },
          {
            id: '2',
            isDefault: false,
            name: 'My Style - 2',
            coverImg: [],
            imgNumber: 1326
          },
          {
            id: '3',
            isDefault: false,
            name: 'My Style - 3',
            coverImg: ['https://aimoda-ai.oss-us-east-1.aliyuncs.com/aimoda-homepage-image/Group_77.svg'],
            imgNumber: 11
          }
        ]),
      1000
    )
  )
}

export function featchFavouritesData(id: string): Promise<FavouriteImage> {
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
          message: '',
          success: true
        }),
      1000
    )
  )
}
