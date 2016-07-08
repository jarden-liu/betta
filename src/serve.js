var path = require('path');
var fs = require("fs");
var colors = require('colors');
var $q = require('q');
var open = require("open");
var ip = require('ip');


var livereload = require(path.resolve(__dirname, 'serve', 'livereloadServer'));
var devServer = require(path.resolve(__dirname, 'serve', 'devServer'));
var runGulp = require(path.resolve(__dirname, 'serve', 'runGulp'));
var livereloadTemplate = '<script>  document.write("<script src=\\"http://' + ip.address() + ':35729/livereload.js\\"></scr"); document.write("ipt>");</script>';


module.exports = function() {

    getConfig().then(function(data) {
        livereload(data).then(function(port) {
            var template = livereloadTemplate.replace('35729', port.toString());
            devServer('dev', template).then(function(port) {
                open('http://' + ip.address() + ':' + port);
                runGulp(data);
            });
        });

    }, function(e) {
        console.log(colors.red('betta.project file error.'));
        console.log(colors.red(e));
    });

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
