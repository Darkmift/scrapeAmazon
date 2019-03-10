const puppeteer = require('puppeteer');

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
//dreak
	// const productImages = await page.goto(productUrl).evaluate(() =>
	// Array.from(document.querySelectorAll('div#altImages img'))
	// .map(productImages => productImages.src))

	const productImages = await page.evaluate(() =>
		Array.from(document.querySelectorAll('div#imageBlock_feature_div img'))
		.map(productImages => productImages.src)
		
		)


	console.log('categories: ',categories);
	console.log('title: ',title);
	console.log('productUrl: ',productUrl);
	console.log('productImages: ',productImages);

	await browser.close();

/***/
	// let results=[];
	// for (let i = 0; i < productUrl.length; i++) {
	// 	const browser = await puppeteer.launch();
	// 	const page = await browser.newPage();
	// 	const url = `https://www.amazon.com/gp/bestsellers${productUrl[i]}`;
	// 	await page.goto(url);

	// 	results.push(productImages)
	// 	console.log(productImages,results);
	// 	await browser.close();
	// }
/***/


})();







//console.log(results)

   // const url = urls[i];
    // await page.goto(`${url}`);
    // await page.waitForNavigation({ waitUntil: 'networkidle' });
    // console.log(urls);
	// const promiseArray = await productUrl.map((url)=>{
	// 	page.goto(url);
	// })
	// console.log(promiseArray);

	// Promise.all([promise1, promise2, promise3]).then(function(values) {
	//   console.log(values);
	// });
	// const productImages = await page.goto(productUrl).evaluate(() =>
	// 	Array.from(document.querySelectorAll('div#altImages img'))
	// 	.map(productImages => productImages.src)
	// 	)
// (async () =>{
// 	const browser = await puppeteer.launch();
// 	const page = await browser.newPage();
// 	const url = 'https://www.amazon.com/Exploding-Kittens-LLC-EKG-ORG1-1-Card/dp/B010TQY7A8/ref=zg_bs_toys-and-games_home_1?_encoding=UTF8&psc=1&refRID=8NWY98AWG4X3VTTQ0RZV';
// 	await page.goto(url);
	
// 	const title = await page.evaluate(() =>
// 	Array.from(document.querySelectorAll('h1#title.a-size-large.a-spacing-none'))
// 	.map(title => title.innerText.trim())
// 		)

// 	const productImages = await page.evaluate(() =>
// 	Array.from(document.querySelectorAll('div#altImages img'))
// 	.map(productImages => productImages.src)
// 		)

// 	console.log(title);
// 	console.log(productImages);

// 	await browser.close();

// })();

