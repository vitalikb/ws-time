const WebSocket = require('ws');
const http = require('http');
const url = require('url');
const fs = require('fs');
const os = require('os');

const wss = new WebSocket.Server({noServer: true});


wss.on('connection', function connection(ws, req) {
    const ip = 'x-forwarded-for' in req.headers ?
        req.headers['x-forwarded-for'].split(/\s*,\s*/)[0] :
        req.socket.remoteAddress;

    console.log("Connected from:" + ip);
    ws.send("Connected to: " + os.hostname());
});

const interval = setInterval(function ping() {
    const now = (new Date()).toUTCString()
    wss.clients.forEach(function each(ws) {
        ws.send(now);
    });
}, 2000);

wss.on('close', function close() {
    clearInterval(interval);
});


const server = http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(fs.readFileSync('index.html'));
        res.end();
    }
);

server.on('upgrade', function upgrade(request, socket, head) {
    const pathname = url.parse(request.url).pathname;

    if (pathname === '/ws') {
        wss.handleUpgrade(request, socket, head, function done(ws) {
            wss.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});

server.listen(8080);