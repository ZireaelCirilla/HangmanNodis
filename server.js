var http = require("http");
var redis = require("redis");
var client = redis.createClient(46379, "localhost");

http.createServer(function (request, response) {

}).listen(8080);

client.on("error", function (err) {
    console.log("Error " + err);
});

client.on('connect', function () {
    console.log('connected');
});


function indexAllMovies() {

}

function storeMovie(params) {
    client.hmset(myhash, JSON.stringify(params), function (err, reply) {
        if (!err) {
            console.log(reply);
        } else {
            console.log(err);
        }
    });
}

// Console will print the message
console.log('Server running at localhost:8080');