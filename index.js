const cheerio = require('cheerio');
const express = require('express');
const request = require('request');
const puppeteer = require('puppeteer');
const fs = require('fs');

const app = express();
const writeStream = fs.createWriteStream('result.html');
const port = process.env.PORT || 3000;

var innerText = '';

async function run(category, keyword) {

    const browser = await puppeteer.launch( {
        headless: true,  //change to true in prod!
        timeout: 100000
    });

    const page = await browser.newPage();
	const url = 'https://www.aliexpress.com/wholesale?catId=' + category + '&SearchText='+ keyword;

    await page.goto(url);

    var content = await page.content();

    // innerText = await page.evaluate(() =>  {
    //     return JSON.parse(document.querySelector("body").innerText);
    // });

    //console.log("innerText now contains the JSON");
    //console.log(innerText);

    //I will leave this as an excercise for you to
    //  write out to FS...

    await browser.close();


    return content;

};

function search(category, keyword) {

    const url = 'https://www.aliexpress.com/wholesale?catId=' + category + '&SearchText='+ keyword;

	request(url, function (error, response, body) {
    	if (!error && response.statusCode === 200) {
        	innerText = body;
     	}
	});

	//console.log(innerText);
	writeStream.write(innerText);

    return innerText;

};

app.get('/api/products/:category/:keyword', (req, res) => {
    run(req.params.category, req.params.keyword).then(result => {
		// Parse HTML
		const $ = cheerio.load(result);
		const products = $('.glosearch-wrap').html();
		writeStream.write(products);

        res.send(result);

    }).catch(function () {
		console.log("Promise Rejected");
   });
	//console.log(body);
			// Parse HTML
			// const $ = cheerio.load(result);

			// const products = $('#root').html();



			// $('.list-item').each((i, el) => {
			// 	const item = $(el).text();
			// 	console.log(item);
			// });

			// const $ = cheerio.load('<h2 class="title">Hello world</h2>');

			// const item = $('h2.title').text();
			// console.log(item);

});

app.listen(port, () => console.log(`wphobby-api app listening on port ${port}!`));
