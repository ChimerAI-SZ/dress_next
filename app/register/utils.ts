import forge from 'node-forge';

// 使用 fetch 从本地静态文件加载公钥
export async function loadPublicKey(filePath: string) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load public key: ${response.statusText}`);
    }
    const pem = await response.text();
    return pem;
  } catch (error) {
    console.error("Error loading public key:", error);
    throw error;
  }
}
export function importPublicKey(pem: string) {
    const publicKey = forge.pki.publicKeyFromPem(pem); // 使用 node-forge 加载 PEM 格式的公钥
    if (!publicKey) {
      console.error('Failed to load public key.');
    }
    return publicKey;
  }
  

// 使用 RSA-PKCS1-V1_5 加密数据
export function encryptData(publicKey: forge.pki.PublicKey, data: { email: string; timestamp: number }) {
    const jsonData = JSON.stringify(data);  // 将数据转为字符串
  
    // 使用公钥的 encrypt 方法
    const encrypted = publicKey.encrypt(jsonData, 'RSAES-PKCS1-V1_5'); // 使用 RSAES-PKCS1-V1_5 加密
    return encrypted;
  }
// 将加密后的数据转换为 Base64 字符串
export function arrayBufferToBase64(buffer: string): string {
  return forge.util.encode64(buffer);  // 转换为 Base64 字符串
}