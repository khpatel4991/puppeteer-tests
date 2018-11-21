const responseInterceptor = async (res, provider) => {
  const responseBodyBuffer = await res.buffer();
  const response = Buffer.concat([
    Buffer.from(res.status().toString()),
    Buffer.from(res.headers()["content-type"]),
    responseBodyBuffer
  ]);
  await provider.setCachedResponse(res.url(), response);
};

module.exports = responseInterceptor;
