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
			notice: 'product data achieved...now to iterate entry into each url and scrap relevant data',
			productInfo: productInfo,
			productInfoObjLength: productInfo.length
		});

		//enter each url
		for (let i = 0; i < productInfo.length; i++) {

			await page.goto(productInfo[i].url, {
				waitLoad: true,
				waitNetworkIdle: true // defaults to false
			});
			await page.addScriptTag({
				url: 'https://code.jquery.com/jquery-3.2.1.min.js'
			})

			/*
			itelmlist = document.querySelectorAll('ol#zg-ordered-list > li > span > div > span')[0].children[0].innerHTML
			*/
			let productList = {};
			const itemList = await page.evaluate(() => {
				try {
					return $('#zg-ordered-list');
				} catch (err) {
					reject(err.toString());
				}
			});

			// const itemList = await page.$$('#zg-ordered-list');

			// const itemList = await page.$eval(selector, (element) => {
			// 	return element.innerHTML
			// })

			// const itemList = await page.$$eval('ol#zg-ordered-list',el=>el.children);

			console.log('length: ', itemList)
			//loop over each li on inner page
			// for (let j = 0; j < itemList.length; j++) {
			// 	const item = await itemList[i].$eval('h2', (h2) => h2.innerText);
			// 	productList[j] = item;
			// }

			console.log({
				notice: `iteration ${i} in ${productInfo[i].title}`,
				// productList: productList.length
			})

			await page.goto(base_url, {
				waitLoad: true,
				waitNetworkIdle: true // defaults to false
			});

		}
	});