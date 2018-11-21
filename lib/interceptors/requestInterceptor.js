const requestInterceptor = async (request, provider) => {
  let cacheHit = false;
  let response = null;
  const data = await provider.getCachedResponse(request.url());
  if (data !== null) {
    cacheHit = true;
    response = data;
  }
  return Promise.resolve({
    cacheHit,
    response
  });
};
module.exports = requestInterceptor;
