var path = require('path');
var argv = require('yargs').argv;
var colors = require('colors');


var funcArray = {
    "v": require(path.resolve(__dirname, 'version')),
    "version": require(path.resolve(__dirname, 'version')),
    "help": require(path.resolve(__dirname, 'help')),
}


function init() {
    for (var arg in argv) {
        if (argv[arg] && funcArray[arg]) {
            funcArray[arg]();
        }
    }
    if (argv._[0]) {
        run(argv._[0]);
    } else {
        funcArray['help']();
    }
}

var bashPaths = {
    'serve': require(path.resolve(__dirname, '..', 'src', 'serve.js'))
};

function run(bash) {
    if (bashPaths[bash]) {
        bashPaths[bash]();
    } else {
        funcArray['help']();
    }

}

module.exports = init;
