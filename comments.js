// Create web server with node.js
// Run with: node comments.js

// Load the http module to create an http server.
var http = require('http');
var fs = require('fs');
var url = require('url');

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
    var parsedUrl = url.parse(request.url, true);
    var path = parsedUrl.pathname;
    var query = parsedUrl.query;
    var method = request.method;

    if (path === '/comments' && method === "GET") {
        handleCommentsGet(request, response);
    } else if (path === '/comments' && method === "POST") {
        handleCommentsPost(request, response);
    } else {
        response.writeHead(404, {'Content-Type': 'text/plain'});
        response.end('404 Not Found\n');
    }
});

function handleCommentsGet(request, response) {
    fs.readFile('comments.json', function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(data);
    });
}

function handleCommentsPost(request, response) {
    var body = '';

    request.on('data', function (data) {
        body += data;
    });

    request.on('end', function () {
        var comment = JSON.parse(body);
        console.log("Got comment: ", comment);
        fs.readFile('comments.json', function(err, data) {
            if (err) {
                console.error(err);
                process.exit(1);
            }

            var comments = JSON.parse(data);
            comments.push(comment);

            fs.writeFile('comments.json', JSON.stringify(comments, null, 4), function(err) {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
            });
        });

        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.end('Post successful');
    });
}

// Listen on port 8000, IP defaults to
