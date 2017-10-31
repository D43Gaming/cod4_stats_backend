const LOG = require('../utils/log')(module);
const _ = require('lodash');
const DbConn = require('../utils/db-connection');
const dbConnection = new DbConn();
const sql = require('sql-query');
const query = sql.Query();
const select = query.select();
const insert = query.insert();

let instance;

function WeaponStatsController() {
    return !instance ? instance = this : instance;
}

WeaponStatsController.prototype.getStats = (playerid32, serverid, callback) => {
    let querySelect = select.from('weaponstats').where(playerid32, serverid).build();
    dbConnection.getConnection().query(querySelect, (err, res) => {

    });
};

module.exports = WeaponStatsController;