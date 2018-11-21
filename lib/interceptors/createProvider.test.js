const createProvider = require("./createProvider");

describe("Create Provider", () => {
  test("throw if no redis argument", () => {
    expect(() => createProvider()).toThrow("Redis Required");
  });

  test("provider has getCachedResponse method", async () => {
    const redis = {};
    const provider = createProvider(redis);
    expect(provider).toHaveProperty("getCachedResponse");
  });

  test("provider has setCachedResponse method", async () => {
    const redis = {};
    const provider = createProvider(redis);
    expect(provider).toHaveProperty("setCachedResponse");
  });

  test("when redis resolves with null, getCachedResponse returns response", async () => {
    const expected = null;
    const redis = {
      getBuffer: jest.fn().mockResolvedValue(expected)
    };
    const provider = createProvider(redis);
    const result = await provider.getCachedResponse();
    expect(redis.getBuffer).toHaveBeenCalledTimes(1);
    expect(result).toBe(null);
  });

  test("when redis resolves with value, getCachedResponse returns response", async () => {
    const expected = Buffer.from([
      200,
      "text/html",
      Buffer.from("<html><body><p>Puppeteer is Awesome!!</p></body></html>")
    ]);
    const redis = {
      getBuffer: jest.fn().mockResolvedValue(expected)
    };
    const provider = createProvider(redis);
    const result = await provider.getCachedResponse();
    expect(redis.getBuffer).toHaveBeenCalledTimes(1);
    expect(result.equals(expected)).toBe(true);
  });
});
