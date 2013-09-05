/**
 * Start simple webserver so require text files are loaded correctly.
 */
var connect = require('connect');
connect.createServer(
    connect.static(__dirname)
).listen(8080);