'use strict';

const http = require('http');
const fs = require('fs');
const querystring = require('querystring');
const PORT = process.env.PORT || 3000;

function table(elementName, elementSymbol, atomicNumber, description) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>The Elements - ${elementName}</title>
    <link rel="stylesheet" href="/css/styles.css">
  </head>
  <body>
    <h1>${elementName}</h1>
    <h2>${elementSymbol}</h2>
    <h3>Atomic number ${atomicNumber}</h3>
    <p>${description}</p>
    <p><a href="/">back</a></p>
  </body>
  </html>`;
}

/*==============================
===========WRITE FILE===========*/
function writeFile(filePath, fileContent){
  fs.writeFile('./public/' + filePath, fileContent);
}

/*==============================
============SEND 404============*/
function send404Response(res){
  fs.readFile('./public/404.html', (error, data) => {
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.write(data.toString());
    res.end();
  });
}

/*==============================
============SEND 500============*/
function send500Response(res){
  res.writeHead(500, {'Content-Type:': 'application/json'});
  res.write({ "error" : "resource /carbon.html does not exist" });
  res.end();
}

/*==============================
===========GET METHOD===========*/
function handleGET(req, res){
  // make index.html the default document
  if(req.url === '/') {
    req.url = '/index.html';
  }
  fs.readFile('./public' + req.url, (error, data) => {
    if(error) {
      send404Response(res);
    }
    else {
        res.writeHead(200);
        res.write(data.toString());
        res.end();
    }
  });
}

/*==============================
===========POST METHOD==========*/
function handlePOST(req, res) {

  req.on('data', (chunk) => {
    var postQuery = querystring.parse(chunk.toString());
    const replaceValue =
      `<li>
      <a href="${postQuery.elementName.toLowerCase()}.html">${postQuery.elementName}</a>
    </li>
  </ol>`;
    writeFile(`${postQuery['elementName'].toLowerCase()}.html`, table(postQuery.elementName, postQuery.elementSymbol, postQuery.elementAtomicNumber, postQuery.elementDescription));
    fs.readFile('./public/index.html', (err, data) => {
      var newIndex = data.toString().replace(`</ol>`, replaceValue);
      writeFile('index.html', newIndex);
    });
  });
  req.on('end', () => {

  });

}

/*==============================
===========PUT METHOD===========*/
function handlePUT(req, res) {
  req.on('data', (chunk) => {
    var putQuery= querystring.parse(chunk.toString());
    writeFile(req.url, table(putQuery.elementName, putQuery.elementSymbol, putQuery.elementAtomicNumber, putQuery.elementDescription), (error, data) => {
      if(error) {send500Response();}
    });

  });
}

/*==============================
==========DELETE METHOD=========*/
function handleDELETE(req, res) {
  req.on('data', (chunk) => {
    var meh = querystring.parse(chunk.toString());
  });
}

/*==============================
===========THE SERVER===========*/
const server = http.createServer((req, res) => {
  // someone connected

  switch( req.method ){
    case 'GET':
      handleGET(req, res);
      break;
    case 'POST':
      handlePOST(req, res);
      break;
    case 'PUT':
      handlePUT(req, res);
      break;
    case 'DELETE':
      handleDELETE(req, res);
      break;
    default:
      send404Response(res);
  }

});

server.listen(PORT, ()=> console.log(`server listening on port ${PORT}`));
