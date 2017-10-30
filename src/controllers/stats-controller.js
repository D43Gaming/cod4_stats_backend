const LOG = require('../utils/log')(module);
const _ = require('lodash');
const dbConnection = require('../utils/db-connection');
const sql = require('sql-query');
const query = sql.Query();
const select = query.select();

let instance;

function StatsController() {
    if (!instance) {
        instance = this;
    }

    return instance;
}

StatsController.prototype.getData = (playerId, serverId, callback) => {
    let query = select.from('stats').where({ playerId, serverId }).build();

    dbConnection.query(query, (err, res) => {
        if (err) throw err;

        callback(res);
    });
};

module.exports = StatsController;
