var path = require('path');
var colors = require('colors');
var $q = require('q');
var ip = require('ip');
var livereload = require('livereload');


var defaultLivereloadPort = 35729;

module.exports = createLiveReloadServer;

function createLiveReloadServer(data, port) {
    var _port = port || defaultLivereloadPort;
    var d = $q.defer();

    startupLivereloadServer(_port).then(function(res) {
        console.info(colors.green('Running live reload server:') + ' http://' + ip.address() + ':' + res.port);
        res.server.watch(data.watchPatterns);
        if (data.watchPatterns && data.watchPatterns.length > 0) {
            var result = showWatchPatterns(data.watchPatterns);
        }
        d.resolve(res.port);
    }, function(p) {
        var newPort = p + 1;
        console.log(colors.green(p + ' has been occupied,use ' + newPort + ' instead.'));
        createLiveReloadServer(data, newPort).then(function(port) {
            d.resolve(port);
        });
    });
    return d.promise;
}


function startupLivereloadServer(port) {
    var d = $q.defer();

    var server = livereload.createServer({
        port: port
    });

    server.server.on('error', function(error) {
        var errorInfo = error.toString();
        if (errorInfo.indexOf('Error: listen EADDRINUSE') > -1) {
            //listen error
            d.reject(port);

        } else {
            //other error
            console.log(colors.red(error));
            process.exit();
        }
    });
    server.server.on('listening', function() {
        var data = {
            server: server,
            port: port
        }
        d.resolve(data);
    });
    return d.promise;
}



function showWatchPatterns(taskArr) {
    var str = [];
    for (var i = 0; i < taskArr.length; i++) {
        str.push(i + ' = ' + taskArr[i]);
    }
    console.log(colors.green('Watching::') + colors.white(str.join(', ')));
}
