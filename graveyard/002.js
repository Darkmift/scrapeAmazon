const puppeteer = require('puppeteer');
const cheerio = require('cheerio')

(async () =>{

	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	const url = 'https://www.amazon.com/gp/bestsellers/';
	await page.goto(url);
	
	const categories = await page.evaluate(() =>
	Array.from(document.querySelectorAll('ul#zg_browseRoot li'))
	.map(categories => categories.innerText.trim())
		)

	const title = await page.evaluate(() =>
	Array.from(document.querySelectorAll('a.a-link-normal'))
	.map(title => title.innerText.trim())
		)

	const productUrl = await page.evaluate(() =>
	Array.from(document.querySelectorAll('a.a-link-normal'))
	.map(productUrl => productUrl.pathname.trim())
		)

	const productImages = await page.evaluate(() =>
		Array.from(document.querySelectorAll('div#imageBlock_feature_div img'))
		.map(productImages => productImages.src)
		
		)

	console.log('categories: ',categories);
	console.log('title: ',title);
	console.log('productUrl: ',productUrl);
	console.log('productImages: ',productImages);

	await browser.close();

})();