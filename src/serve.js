var path = require('path');
var shell = require('shelljs');
var fs = require("fs");
var colors = require('colors');
var $q = require('q');
var moment = require('moment');
moment.locale('cs');
var express = require('express');
var ip = require('ip');
var livereload = require('livereload');

var livereloadTemplate = '<script>  document.write("<script src=\\"http://' + ip.address() + ':23333/livereload.js\\"></scr"); document.write("ipt>");</script>';


module.exports = function() {



    getConfig().then(function(data) {

        createLiveReloadServer(data);
        createServer('dev').then(function() {
            gulpStartup(data);
        });


    }, function(e) {
        console.log(colors.red('betta.project file error.'));
        console.log(colors.red(e));
    });

}

function createLiveReloadServer(data) {

    var port = 23333
    var server = livereload.createServer({
        port: port
    });
    console.info(colors.green('Running live reload server:') + ' http://' + ip.address() + ':' + port);

    server.watch(data.watchPatterns);
    if (data.watchPatterns && data.watchPatterns.length > 0) {
        var result = showWatchPatterns(data.watchPatterns);
    }
}



function showWatchPatterns(taskArr) {
    var str = [];
    for (var i = 0; i < taskArr.length; i++) {
        str.push(i + ' = ' + taskArr[i]);
    }
    console.log(colors.green('Watching::') + colors.white(str.join(', ')));
}



function createServer(staticFloder) {
    var d = $q.defer();
    var app = express();

    app.get('/', function(req, res) {
        fs.readFile(path.resolve(staticFloder, 'index.html'), function(err, html) {
            if (err) {
                res.end('index.html  No Found');
                return;
            }
            res.send(livereloadTemplate + html.toString());
        });
    });

    app.use(express.static(staticFloder));
    var server = app.listen(8081, function() {
        var port = server.address().port;
        d.resolve();
        console.info(colors.green('Running dev server:') + ' http://' + ip.address() + ':' + port);
    });
    return d.promise;

}


function gulpStartup(config) {
    if (shell.which('gulp')) {
        if (config.gulpStartupTasks && config.gulpStartupTasks.length > 0) {
            var result = showGulpTasks(config.gulpStartupTasks);
            shell.exec('gulp ' + result,{async:true});
        } else {
            shell.exec('gulp');
        }
    } else {
        console.log(colors.white(getTime() + ' gulp not found.'));
        console.log(colors.white(getTime() + ' Try running: npm install -g gulp.'));
    }
}


function getTime() {
    return '[' + moment().format('LTS') + ']';
}

function showGulpTasks(taskArr) {
    var str = [];
    var task = '';
    for (var i = 0; i < taskArr.length; i++) {
        str.push(i + ' = ' + taskArr[i]);
        task += taskArr[i] + ' ';
    }
    console.log(colors.green('Gulp startup tasks:') + colors.white(str.join(', ')));
    return task;
}




function getConfig() {
    var d = $q.defer();
    try {
        var data = JSON.parse(fs.readFileSync('betta.project').toString());
        d.resolve(data);
    } catch (e) {
        d.reject(e);

    }
    return d.promise;
}
