var path = require('path');
module.exports = function version() {
    var config = require(path.resolve(__dirname, '..', 'package.json'));
    console.log(config.version);
    process.exit(1);
}
