const requestInterceptor = require("./requestInterceptor");
describe("Request Interceptor", () => {
  test("returns true with cache hit", async () => {
    const req = {
      url: jest.fn().mockReturnValue("http://localhost:43434"),
      resourceType: jest.fn().mockReturnValue("text/html")
    };
    const provider = {
      getCachedResponse: jest.fn().mockResolvedValue({
        status: 200,
        contentType: "text/html",
        body: "<html><body><p>Puppeteer is Awesome!!</p></body></html>"
      })
    };
    const result = await requestInterceptor(req, provider);
    expect(provider.getCachedResponse).toHaveBeenCalledTimes(1);
    expect(provider.getCachedResponse).toHaveBeenCalledWith(
      "http://localhost:43434"
    );
    expect(result).toHaveProperty("cacheHit", true);
    expect(result).toHaveProperty("response");
    expect(result.response).toHaveProperty("status");
    expect(result.response).toHaveProperty("contentType");
    expect(result.response).toHaveProperty("body");
  });
  test("returns false with cache miss", async () => {
    const req = {
      url: jest.fn().mockReturnValue("http://localhost:43434")
    };
    const provider = {
      getCachedResponse: jest.fn().mockResolvedValue(null)
    };
    const result = await requestInterceptor(req, provider);
    expect(provider.getCachedResponse).toHaveBeenCalledTimes(1);
    expect(provider.getCachedResponse).toHaveBeenCalledWith(
      "http://localhost:43434"
    );
    expect(result).toHaveProperty("cacheHit", false);
    expect(result).toHaveProperty("response", null);
  });
});
