var path = require('path');
var fs = require("fs");
var colors = require('colors');
var $q = require('q');
var express = require('express');
var ip = require('ip');


var defaultPort = 8081;

module.exports = createServer;

function createServer(staticFloder,template, port) {
    var d = $q.defer();
    var _port = port || defaultPort;
    var app = express();

    app.get('/', function(req, res) {
        fs.readFile(path.resolve(staticFloder, 'index.html'), function(err, html) {
            if (err) {
                res.end('index.html  No Found');
                return;
            }
            res.send(template + html.toString());
        });
    });
    app.use(express.static(staticFloder));


    startupServer(app, _port).then(function(port) {
        console.info(colors.green('Running dev server:') + ' http://' + ip.address() + ':' + port);
        d.resolve(port);
    }, function(p) {
        var newPort = p + 1;
        console.log(colors.green(p + ' has been occupied,use ' + newPort + ' instead.'));
        createServer(staticFloder,template, newPort).then(function(port) {
            d.resolve(port);
        });
    });;


    return d.promise;

}


function startupServer(app, port) {
    var d = $q.defer();
    var server = app.listen(port, function(data) {
        var port = server.address().port;
        d.resolve(port);
    });

    server.on('error', function(error) {
        var errorInfo = error.toString();
        if (errorInfo.indexOf('Error: listen EADDRINUSE') > -1) {
            //listen error
            app = null;
            d.reject(port);
        } else {
            //other error
            console.log(colors.red(error));
            process.exit();
        }
    });

    return d.promise;
}
