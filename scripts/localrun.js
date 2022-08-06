const http = require('http');
const fs = require('fs');
const path = require('path');

let server = http.createServer((req, res) => {
    try {
        let filePath = path.join( 'build', req.url == '/' ? 'index.html' : req.url);
        res.end(fs.readFileSync(filePath));
    } catch (e) {
        res.statusCode = 404;
        console.error(e);
        res.end('Not found');
    }
});

server.listen(8080, () => {
    console.log('Server listening on port 8080');
});