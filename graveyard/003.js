const puppeteer = require('puppeteer');
const base_url = 'https://www.amazon.com/gp/bestsellers/';

puppeteer.launch({
	headless: true,
	args: ['--no-sandbox', '--disable-setuid-sandbox']
}).then(async browser => {
	const page = await browser.newPage();
	await page.setViewport({
		width: 320,
		height: 600
	});

	await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 9_0_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13A404 Safari/601.1')

	await page.goto(base_url, {
		waitUntil: 'networkidle0'
	});

	await page.waitForSelector('div#zg_col1');
	await page.addScriptTag({
		url: 'https://code.jquery.com/jquery-3.2.1.min.js'
	})

	console.log('Hi there!');
	//
	const categories = await page.evaluate(() => {
		try {
			return Array.from(document.querySelectorAll('ul#zg_browseRoot li'))
				.map(categories => categories.innerText.trim())
		} catch (err) {
			reject(err.toString());
		}
	});
	//
	console.log(categories)
	/*
	const result = await page.evaluate(() => {
		try {
			var data = [];
			$('h3.loop__post-title').each(function () {
				const url = $(this).find('a').attr('href');
				const title = $(this).find('a').attr('title')
				data.push({
					'title': title,
					'url': url
				});
			});
			return data; // Return our data array
		} catch (err) {
			reject(err.toString());
		}
	});

		// let's close the browser
		await browser.close();

		// ok, let's log blog titles...
		for (var i = 0; i < result.length; i++) {
			console.log('Post: ' + result[i].title + ' URL: ' + result[i].url);
		}
		process.exit();
	}).catch(function (error) {
		console.error('No way Paco!');
		process.exit();*/
});