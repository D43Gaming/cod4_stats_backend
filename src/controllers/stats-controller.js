const LOG = require('../utils/log')(module);
const _ = require('lodash');
const DbConn = require('../utils/db-connection');
const dbConnection = new DbConn();
const sql = require('sql-query');
const query = sql.Query();

let instance;

const defaultStats = {
    kills : 0,
    deaths : 0,
    killstreak : 0,
    deathstreak : 0,
    hardpoint_radar_mp : 0,
    hardpoint_airstrike_mp : 0,
    hardpoint_helicopter_mp : 0,
    playtime : 0,
    objective_plant : 0,
    objective_defuse : 0,
    objective_capture : 0
};

const columnNames = _.keys(defaultStats);

function StatsController() {
    if (!instance) {
        instance = this;
    }

    return instance;
}

StatsController.prototype.getStats = (playerid32, serverid, callback) => {
    let querySelect = query.select().from('stats').select(columnNames).where({ playerid32: playerid32, serverid: serverid }).build();
    console.log(querySelect);

    dbConnection.getConnection().query(querySelect, (err, res) => {
        if (err) {
            LOG.error(err);
	    console.log(err);
            //return defaultStats;
        };

	console.log(res);
	console.log(defaultStats);
        console.log(_.isEmpty(res) ? defaultStats : res[0]);
        callback(_.isEmpty(res) ? defaultStats : res[0]);
    });
};

StatsController.prototype.updateStats = (playerid32, serverid, data) => {
    let tmp = _.clone(defaultStats);
    let statsData = _.assign(tmp, data, { playerid32, serverid });

    let arr = _.map(data, function (v, k) {
        return `${k} = ${v}`; //VALUES
    });

    let queryUpdate = `${query.insert().into('stats')
        .set(statsData)
        .build()} ON DUPLICATE KEY UPDATE ${arr.toString()}`;

	console.log(queryUpdate);

    dbConnection.getConnection().query(queryUpdate, (err, res) => {
        if (err) {
            LOG.error(err);
        } else {
            LOG.info(`Data was insert, playerId = ${playerid32}, serverId = ${serverid}`);
        }
    });

};

module.exports = StatsController;
