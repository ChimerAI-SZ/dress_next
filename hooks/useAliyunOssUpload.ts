import { useState } from 'react';
import OSS from 'ali-oss';

interface UploadState {
  isUploading: boolean;
  uploadProgress: number;
  uploadedUrl: string | undefined;
}

interface UseAliyunOssUploadReturn {
  isUploading: boolean;
  uploadProgress: number;
  uploadedUrl: string | undefined;
  uploadToOss: (file: File) => Promise<void>;
}

const useAliyunOssUpload = (): UseAliyunOssUploadReturn => {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    uploadProgress: 0,
    uploadedUrl: undefined,
  });

  const uploadToOss = async (file: File) => {
    setUploadState({ ...uploadState, isUploading: true, uploadProgress: 0 });

    try {
      const client = new OSS({
        region: import.meta.env.VITE_OSS_REGION!,
        accessKeyId: import.meta.env.VITE_OSS_ACCESS_KEY_ID!,
        accessKeySecret: import.meta.env.VITE_OSS_ACCESS_KEY_SECRET!,
        bucket: import.meta.env.VITE_OSS_BUCKET!,
      });

      const result = await client.multipartUpload(file.name, file, {
        progress: (p: number) => {
          setUploadState({
            ...uploadState,
            uploadProgress: Math.round(p * 100),
          });
        },
      });
      // 构建文件的URL
      const uploadedUrl = `https://${import.meta.env.VITE_OSS_BUCKET}.${import.meta.env.VITE_OSS_REGION}.aliyuncs.com/${result.name}`;
      // console.log(uploadedUrl);
      setUploadState({
        isUploading: false,
        uploadProgress: 100,
        uploadedUrl,
      });
    } catch (err) {
      console.error('Error uploading to OSS:', err);
      setUploadState({ ...uploadState, isUploading: false });
    }
  };

  return {
    ...uploadState,
    uploadToOss,
  };
};

export default useAliyunOssUpload;
