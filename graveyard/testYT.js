const puppeteer = require('puppeteer');

puppeteer.launch({
    headless: true,
    // args: ['--no-sandbox', '--disable-setuid-sandbox']
}).then(async browser => {
    const page = await browser.newPage();
    await page.setViewport({
        width: 1000,
        height: 800
    });
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 9_0_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13A404 Safari/601.1');
    await page.setRequestInterception(true);
    //abort image crawl
    page.on('request', (req) => {
        if (req.resourceType() === 'image') {
            req.abort();
        } else {
            req.continue();
        }
    });

    //goto and crawl on:
    await page.goto('https://experts.shopify.com/');
    //wait for element to load before proceeding
    await page.waitForSelector('.section');
    //$$=selectall
    const sections = await page.$$('.section');

    //loop over all sections
    for (let i = 0; i < sections.length; i++) {

        await page.goto('https://experts.shopify.com/');
        await page.waitForSelector('.section');
        const sections = await page.$$('.section');

        const section = sections[i];
        const button = await section.$('a.marketing-button');
        const buttonName = await page.evaluate(button => button.innerText, button);
        console.log(buttonName)
        button.click();

        await page.waitForSelector('#ExpertsResults');
        const lis = await page.$$('#ExpertsResults > li ');
        console.log('length: ', lis.length)
            //loop over each li on inner page
        for (let i = 0; i < lis.length; i++) {
            const name = await lis[i].$eval('h2', (h2) => h2 ? h2.innerText : '');
            if (name) {
                console.log({
                    name: name
                })
            }
        }
        ///
    }
    console.log('done');
    await browser.close();
});