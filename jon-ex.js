'use strict';

const http = require('http');
const fs = require('fs');

var PORT = process.env.PORT || 3000;

const ELEMENT_TEMPLATE = fs.readFileSync(`./templates`);

function renderTemplate(template, locals){
  return Object.keys(locals).reduce((renderedTemplate, local) => {
    template = template.replace(`/{{local
    })
  }
}

function handleGET(req, res)

function handlePOST(req, res) {
  let rawBody = '';
  req.on('data', chunk => rawBody += chunk);

  req.on('end', () => {
    let parsedBody = querystring.parse(rawBody);
    console.log(parsedBody);
    let filePath = `./public/$(parsedBody.elemental`
    let fileContents = renderTemplate(ELEMENT_TEMPLATE)
    writeFile(filePath, fileContents);
  });

}

const server = http.createServer((req, res) => {
  console.log(req.method);

  switch( req.method ) {
    case "GET":
      handleGET(req, res);
      break;
    case "POST":
      handlePOST(req, res);
      break;

    default:
      send404(res); //function call send404
  }

  //make index default doc
  if (req.url === '/') {
    req.url = '/index.html';
  }

  fs.readFile(`./public$(req.url)`, (err, requestedFile) => {
    if(err) {
      res.end('404');
    }

    res.end(requestedFile);
  });



});

server.listen(PORT, () => console.log(`server listening on port ${PORT}`));