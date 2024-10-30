import { FavouriteItem } from '@definitions/favourites'

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
            coverImg: [
              'https://aimoda-ai.oss-us-east-1.aliyuncs.com/aimoda-homepage-image/Group_77.svg',
              'https://aimoda-ai.oss-us-east-1.aliyuncs.com/aimoda-homepage-image/Group_76.svg',
              'https://aimoda-ai.oss-us-east-1.aliyuncs.com/aimoda-homepage-image/Group_75.svg'
            ],
            imgNumber: 1326
          },
          {
            id: '3',
            isDefault: false,
            name: 'My Style - 3',
            coverImg: [
              'https://aimoda-ai.oss-us-east-1.aliyuncs.com/aimoda-homepage-image/Group_77.svg',
              'https://aimoda-ai.oss-us-east-1.aliyuncs.com/aimoda-homepage-image/Group_76.svg',
              'https://aimoda-ai.oss-us-east-1.aliyuncs.com/aimoda-homepage-image/Group_75.svg'
            ],
            imgNumber: 11
          }
        ]),
      1000
    )
  )
}
