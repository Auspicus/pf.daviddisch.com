const puppeteer = require('puppeteer');

const PROFILE_TIME = 10_000;

(async () => {
  console.log('> Launching browser')

  // launch puppeteer browser in headful mode
  let browser = await puppeteer.launch({
    headless: false,
    // devtools: true,
    // defaultViewport: null,
    // executablePath: '/usr/bin/google-chrome',
    args: [
      // '--ignore-certificate-errors',
      '--no-sandbox',
      // '--disable-setuid-sandbox',
      // '--window-size=1920,1200',
      // "--disable-accelerated-2d-canvas",
      // "--disable-gpu"
    ]
  });

  console.log('> Launched browser')

  // start a page instance in the browser
  let page = (await browser.pages())[0];

  // start the profiling, with a path to the out file and screenshots collected
  await page.tracing.start({
    path: `/tmp/trace-${new Date().getTime()}.json`,
    screenshots: false
  });

  console.log('> Navigating to localhost:3000')

  // go to the page
  await page.goto('http://localhost:3000');
  
  console.log(`> Waiting ${Math.floor(PROFILE_TIME / 1000)}s`)

  // wait for as long as you want
  await new Promise((res) => setTimeout(res, PROFILE_TIME))

  console.log('> Saving traces')

  // stop the tracing
  await page.tracing.stop();

  console.log('> Closing browser')

  // close the browser
  await browser.close();
})();
