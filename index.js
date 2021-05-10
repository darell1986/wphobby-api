const puppeteer = require('puppeteer')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

async function run(category, keyword) {

    const browser = await puppeteer.launch( {
        headless: true  //change to true in prod!
    });

    const page = await browser.newPage();
    const url = 'https://api.ali2woo.com/v1/get_products.php?version=1.15.2&page=1&per_page=20&keywords=' + keyword + '&category='.category;

    await page.goto(url);

    var content = await page.content();

    innerText = await page.evaluate(() =>  {
        return JSON.parse(document.querySelector("body").innerText);
    });

    //console.log("innerText now contains the JSON");
    //console.log(innerText);

    //I will leave this as an excercise for you to
    //  write out to FS...

    await browser.close();

    return innerText;

};

app.get('/api/products/:category/:keyword', (req, res) => {
    run(req.params.category, req.params.keyword).then(result => {
        res.send(result);
    });
});

app.listen(port, () => console.log(`sample-expressjs app listening on port ${port}!`))
