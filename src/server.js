const express = require('express');
const http = require("http");
const log = require('./utils/log')(module);
const config = require('./config');
const app = express();
require('./routes/routes')(app, express);

http.createServer(app)
    .listen(config.get('port')
        , () => log.info('Express server listening on port: ' + config.get('port'))
    );
