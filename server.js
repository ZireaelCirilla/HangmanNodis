var http = require("http");
var redis = require("redis");
var client = redis.createClient(46379, "localhost");
const { promisify } = require('util');
const getAsync = promisify(client.hgetall).bind(client);

var createHash = require('hash-generator');
var hashLength = 8;

http.createServer(function (req, res) {
    var url = req.url;
    var method = req.method;
    if (url === '/movies' && method === "GET") {
        indexAllMovies().then(function (movies) {
            if (movies != null || movies != undefined) {
                var formatArr = [];
                for (var key in movies) {
                    formatArr.push(JSON.parse(movies[key]))
                }
                res.write(JSON.stringify(formatArr));
            } else {
                res.write("empty")
            }
            res.end();
        });
    } else if (url === '/movies' && method === "POST") {
        req.on('data', function (chunk) {
            console.log("Received body data:");
            console.log(chunk.toString());
            storeMovie(chunk.toString());
        });
        console.log(req.body);
        res.end();
    } else {
        res.write('<h1>Hello World!<h1>');
        res.end();
    }
}).listen(8080);

client.on("error", function (err) {
    console.log("Error " + err);
});

client.on('connect', function () {
    console.log('connected');
});

async function indexAllMovies() {
    return getAsync('movies')
}

async function storeMovie(params) {
    console.log(params);
    await client.hmset("movies", createHash(hashLength), params, function (err, reply) {
        console.log("reply: " + reply);
        console.log("err: " + err);
    });
}

console.log('Server running at localhost:8080');