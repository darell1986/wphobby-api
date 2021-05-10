const express = require('express')
const app = express()
const request = require('request')
const port = process.env.PORT || 3000
var innerText = '';

function run(category, keyword) {


    const url = 'https://api.ali2woo.com/v1/get_products.php?version=1.15.2&page=1&per_page=20&keywords=' + keyword + '&category='.category;

	request(url, function (error, response, body) {
    	if (!error && response.statusCode === 200) {
        	innerText = JSON.parse(body);
     	}
	});

    return innerText;

};

// app.get('/api/products/:category/:keyword', (req, res) => {
//     result = run(req.params.category, req.params.keyword);
// 	res.send(result);

// });

function search(category, keyword) {

    const url = 'https://www.aliexpress.com/wholesale?catId=' + category + '&SearchText='+ keyword;

	request(url, function (error, response, body) {
    	if (!error && response.statusCode === 200) {
        	innerText = body;
     	}
	});

    return innerText;

};

app.get('/api/products/:category/:keyword', (req, res) => {
    result = search(req.params.category, req.params.keyword);
	res.send(result);

});

app.listen(port, () => console.log(`wphobby-api app listening on port ${port}!`))
