'use strict';

const http = require('http');
const fs = require('fs');
const querystring = require('querystring');
const PORT = process.env.PORT || 3000;
var queried;

function eleTemplate (queried) {
return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>The Elements - ${queried.elementName}</title>
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <h1>${queried.elementName}</h1>
  <h2>${queried.elementSymbol}</h2>
  <h3>${queried.elementAtomicNumber}</h3>
  <p>${queried.elementDescription}</p>
  <p><a href="/">back</a></p>
</body>
</html>`
}

function indexTemplate (queried) {
return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>The Elements</title>
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <h1>The Elements</h1>
  <h2>These are all the known elements.</h2>
  <h3>These are 2</h3>
  <ol>
    <li>
      <a href="/hydrogen.html">Hydrogen</a>
    </li>
    <li>
      <a href="/helium.html">Helium</a>
    </li>
  </ol>
</body>
</html>`
}

function writeFile(filePath, fileContent){
  fs.writeFile('./public/' + filePath + '.html', fileContent);
}

function send404Response(res){
  fs.readFile('./public/404.html', function(error, data) {
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.write(data.toString());
    res.end();
  });
}

// read file from public/
// send that file to client
function handleGET(req, res){
  // make index.html the default document
  if(req.url === '/') {
    req.url = '/index.html';
  }
  fs.readFile('./public' + req.url, function(error, data){
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

function handlePOST(req, res) {

  req.on('data', function(chunk) {
    queried = querystring.parse(chunk.toString());
    writeFile(queried['elementName'].toLowerCase(), eleTemplate(queried));
    var newIndex = indexTemplate(queried).replace(
    `</ol>`,
      `<li>
        <a href="${queried.elementName}.html">${queried.elementName}</a>
      </li>
    </ol>`
    );
    writeFile('index', newIndex);
  });
  // req.on('end', function() {

  // });

}

const server = http.createServer((req, res) => {
  // someone connected

  switch( req.method ){
    case 'GET':
      handleGET(req, res);

      break;
    case 'POST':
      handlePOST(req, res);

      break;
    default:
      send404Response(res);
  }


});

server.listen(PORT, ()=> console.log(`server listening on port ${PORT}`));

module.exports = queried;