'use strict';

const http = require('http');
const querystring = require('querystring');

const payload = {
  name: 'Kyle',
  greeting: 'Hello Cohort 23',
};

const postData = querystring.stringify(payload);

const options = {
  host: 'localhost',
  port: '8080',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS ${res.statusCode}`);

  res.setEncoding('utf8');

  let responseBody = '';

  res.on('data', (chunk) => {
    responseBody += chunk;
  });

  res.on('end', () => {
    console.log(responseBody);
  });

});

req.on('error', (e) => {
  console.log(`problem with request: ${e.message}`);
});

console.log('data to be sent: ', postData);
req.write(postData);

//perform and end the request
req.end();