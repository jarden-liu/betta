var shell = require('shelljs');
var colors = require('colors');
var moment = require('moment');
moment.locale('cs');

module.exports = gulpStartup;

function gulpStartup(config) {
    if (shell.which('gulp')) {
        if (config.gulpStartupTasks && config.gulpStartupTasks.length > 0) {
            var result = showGulpTasks(config.gulpStartupTasks);
            shell.exec('gulp ' + result, {
                async: true
            });
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
