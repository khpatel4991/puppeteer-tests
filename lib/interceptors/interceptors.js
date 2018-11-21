const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const url = require("url");
const Redis = require("ioredis");
const redis = new Redis();

const createProvider = require("./createProvider");
const requestInterceptor = require("./requestInterceptor");
const responseInterceptor = require("./responseInterceptor");

puppeteer.launch().then(async browser => {
  let req = 0;
  let cached = 0;
  let res = 0;
  const provider = createProvider(redis);
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on("request", async interceptedRequest => {
    // console.time()
    req = req + 1;
    const result = await requestInterceptor(interceptedRequest, provider);
    if (result.cacheHit) {
      cached = cached + 1;
      return interceptedRequest.respond({
        body: result.response.body,
        status: parseInt(result.response.status),
        contentType: result.response.contentType
      });
    }
    interceptedRequest.continue();
  });
  page.on("response", async interceptedResponse => {
    res = res + 1;
    await responseInterceptor(interceptedResponse, provider);
  });
  const startTime = Date.now();
  await page.goto("http://localhost:6789", {
    timeout: 120000
  });
  const endTime = Date.now();
  console.log(`Total Requests Made: ${req}`);
  console.log(`Total Cached Rec: ${cached}`);
  console.log(`Total Response Rec: ${res}`);
  console.log(`Total Load Time ${(endTime - startTime) / 1000}s`);
  await page.screenshot({
    path: "screenshot.png",
    clip: { x: 0, y: 0, width: 1920, height: 1080 }
  });
});
