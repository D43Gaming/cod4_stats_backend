module.exports = function(app, express) {
    const morgan = require('morgan');
    const LOG = require('../utils/log')(module);
    const bodyParser = require('body-parser');
    const errorHandler = require('errorhandler');
    const StatsController = require('../controllers/stats-controller');
    const statsController = new StatsController();
    const WpController = require('../controllers/weapon-stats-controller');
    const weaponController = new WpController();
    const _ = require('lodash');
    // var path = require('path');


    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    //app.use(bodyParser({ keepExtensions: true, uploadDir: __dirname + '../public/uploads' }));

    app.use(morgan('dev'));

    app.all('/stats/*', (req, res, next) => {
        next();
    });

    app.get('/stats/getstats/:playerid/:serverid', isLocal, (req, res) => {
        try {
            let playerId = req.params.playerid;
            let serverId = req.params.serverid;

            if (_.isEmpty(playerId) || _.isEmpty(serverId)) {
                res.json({
                    error: `Wrong parameters, playerId = ${playerId}, serverId = ${serverId}`
                });
            }

            statsController.getStats(playerId, serverId, data => {
                res.json(data);
            });
        } catch (e) {
            LOG.error('Something wrong e = ', e);
            res.json({
                error: e
            })
        }
    });

    app.post('/stats/updatestats/:playerid/:serverid', isLocal, (req, res) => {
        let playerId = req.params.playerid;
        let serverId = req.params.serverid;

        if (_.isEmpty(playerId) || _.isEmpty(serverId)) {
            res.json({
                error: `Wrong parameters, playerId = ${playerId}, serverId = ${serverId}`
            });
        }

        statsController.updateStats(playerId, serverId, req.body);

        res.end();
    });

    app.get('/stats/getweaponstats/:playerid/:serverid', isLocal, (req, res) => {
        let playerId = req.params.playerid;
        let serverId = req.params.serverid;

        if (_.isEmpty(playerId) || _.isEmpty(serverId)) {
            res.json({
                error: `Wrong parameters, playerId = ${playerId}, serverId = ${serverId}`
            });
        }

        weaponController.getStats(playerId, serverId, data => res.json(data));
    });

    app.post('/stats/updateweaponstats/:playerid/:serverid', isLocal, (req, res) => {
        let playerId = req.params.playerid;
        let serverId = req.params.serverid;

        if (_.isEmpty(playerId) || _.isEmpty(serverId)) {
            res.json({
                error: `Wrong parameters, playerId = ${playerId}, serverId = ${serverId}`
            });
        }
        weaponController.updateStats(playerId, serverId, req.body);

        res.end();
    });

    function isLocal(req, res, next) {
        let remote = req.ip || req.connection.remoteAddress;
        if ((remote === '::1') || (remote === 'localhost') || remote === '::ffff:127.0.0.1') {
            return next();
        } else {
            return next('route'); //call next /test route to handle check on authentication.
        }
    }

    app.use(function(req, res) {
        res.status(404).send(`Woops! Requst ${req.url} not found, sorry!`);
    });

    app.use(function(err, req, res, next) {
        if (app.get('env') === 'development') {
            app.use(errorHandler());
        } else {
            res.send(500);
        }
    });


    //var file = req.params.file;
    //var img = fs.readFileSync(__dirname + "../public/uploads/" + file);
    //res.writeHead(200, {'Content-Type': 'image/jpg' });
    //res.end(img, 'binary');

};

