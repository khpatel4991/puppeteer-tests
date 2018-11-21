const createProvider = redis => {
  if (!redis) {
    throw "Redis Required";
  }
  const k = url => `rawu:${url}`;
  return {
    getCachedResponse: async url => {
      const key = k(url);
      const cached = await redis.getBuffer(key);
      if (cached === null) return null;
      return cached;
    },
    setCachedResponse: async (url, responseBuffer) => {
      const key = k(url);
      await redis.setBuffer(key, responseBuffer);
    }
  };
};

module.exports = createProvider;
