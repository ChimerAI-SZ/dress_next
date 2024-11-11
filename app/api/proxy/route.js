import { NextResponse } from 'next/server';

export async function POST(req) {
  console.log('Received POST request at /api/proxy');
  
  try {
    // 解析请求体
    const body = await req.json();
    const path = body.path;
    
    if (!path) {
      throw new Error('Missing "path" in request body');
    }
    
    // 构建目标 API URL
    const apiUrl = `http://47.252.2.86:11118/v1/${path}`;
    
    // 删除 path 属性，不将其转发给远程 API
    delete body.path;

    console.log('Request body:', JSON.stringify(body)); // 打印请求体的字符串

    // 发送请求到远程 API
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify(body),
    });

    // 如果响应失败，则抛出错误
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${errorText}`);
    }

    // 解析远程 API 返回的 JSON 数据
    const data = await response.json();
    
    // 返回代理的响应
    return NextResponse.json(data, { status: response.status });
  
  } catch (error) {
    console.error('Proxy error:', error.message);
    
    // 返回错误响应
    return NextResponse.json(
      { error: `Failed to proxy the request: ${error.message}` },
      { status: 500 }
    );
  }
}
