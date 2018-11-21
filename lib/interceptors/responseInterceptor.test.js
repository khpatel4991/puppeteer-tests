const responseInterceptor = require("./responseInterceptor");
describe("Response Interceptor", () => {
  test("caches response", async () => {
    const bufferResponseBody = Buffer.from("<p>Some Buffered Response</p>");
    const res = {
      url: jest.fn().mockReturnValue("http://localhost:43434"),
      buffer: jest.fn().mockResolvedValue(bufferResponseBody),
      status: jest.fn().mockReturnValue(200),
      headers: jest.fn().mockReturnValue({
        "content-type": "text/html"
      })
    };
    const provider = {
      setCachedResponse: jest.fn()
    };
    const result = await responseInterceptor(res, provider);
    expect(provider.setCachedResponse).toHaveBeenCalledTimes(1);
    expect(provider.setCachedResponse).toHaveBeenCalledWith(
      "http://localhost:43434",
      Buffer.concat([
        Buffer.from("200"),
        Buffer.from("text/html"),
        bufferResponseBody
      ])
    );
  });
});
