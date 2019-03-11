const puppeteer = require("puppeteer");
const base_url = "https://www.amazon.com/gp/bestsellers/";

puppeteer
	.launch({
		headless: true,
		args: ["--no-sandbox", "--disable-setuid-sandbox"]
	})
	.then(async browser => {
		const page = await browser.newPage();
		await page.setViewport({
			width: 320,
			height: 600
		});

		await page.setUserAgent(
			"Mozilla/5.0 (iPhone; CPU iPhone OS 9_0_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13A404 Safari/601.1"
		);

		await page.setRequestInterception(true);
		//abort image crawl
		page.on('request', (req) => {
			if (req.resourceType() === 'image') {
				req.abort();
			} else {
				req.continue();
			}
		});

		await page.goto(base_url, {
			waitLoad: true,
			waitNetworkIdle: true // defaults to false
		});

		console.log("Page load complete...scraping");

		//
		const productInfo = await page.evaluate(() => {
			try {
				return Array.from(document.querySelectorAll('div.zg_homeListLink a')).map(
					product => ({
						title: product.text,
						url: product.href
					})
				);
			} catch (err) {
				reject(err.toString());
			}
		});


		console.log({
			productInfo: productInfo
		});
	});