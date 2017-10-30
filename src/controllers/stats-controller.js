const LOG = require('../utils/log')(module);
const _ = require('lodash');
const dbConnection = require('../utils/db-connection');

let instance;

function StatsController() {
    if (!instance) {
        instance = this;
    }

    return instance;
}

StatsController.prototype.getData = (playerId, serverId, callback) => {
    dbConnection.query(`SELECT * FROM stats WHERE playerId = ${playerId} AND serverId = ${serverId}`
        , (err, res) => {
            if (err) throw err;

            callback(res);
        });
};

module.exports = StatsController;
