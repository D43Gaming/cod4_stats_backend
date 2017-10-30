module.exports = function(app, express) {
    const morgan = require('morgan');
    const LOG = require('../utils/log')(module);
    const bodyParser = require('body-parser');
    const errorHandler = require('errorhandler');
    const StatsController = require('../controllers/stats-controller');
    const statsController = new StatsController();
    const _ = require('lodash');
    // var path = require('path');


    //app.use(bodyParser.urlencoded({extended: false}));
    //app.use(bodyParser.json());
    //app.use(bodyParser({ keepExtensions: true, uploadDir: __dirname + '../public/uploads' }));

    app.use(morgan('dev'));

    app.all('/statsapi/*', function (req, res, next) {
        next();
    });

    app.get('/statsapi/getstats', (req, res) => {
        try {
            let playerId = req.query.playerid;
            let serverId = req.query.serverid;

            if (_.isEmpty(playerId) || _.isEmpty(serverId)) {
                res.json({
                    error: `Wrong parameters, playerId = ${playerId}, serverId = ${serverId}`
                });
            }

            statsController.getData(playerId, serverId, data => {
                res.json(data);
            });
        } catch (e) {
            LOG.error('Something wrong e = ', e);
            res.json({
                error: e
            })
        }
    });

    app.use(function(req, res) {
        res.status(404).send(`Woops! Requst ${req.url} not found, sorry!`);
    });

    app.use(function(err, req, res, next) {
        if (app.get('env') === 'development') {
            app.use(errorHandler());
            //app.use(errorHandler(err, req, res, next));
        } else {
            res.send(500);
        }
    });


    //var file = req.params.file;
    //var img = fs.readFileSync(__dirname + "../public/uploads/" + file);
    //res.writeHead(200, {'Content-Type': 'image/jpg' });
    //res.end(img, 'binary');

};

