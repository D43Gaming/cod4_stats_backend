const LOG = require('../utils/log')(module);
const extend = require('../utils/extend');
const _ = require('lodash');
const DbConn = require('../utils/db-connection');
const dbConnection = new DbConn();
const sql = require('sql-query');
const query = sql.Query();
const defaultStats = {
    shots: 0,
    hits: 0,
    headshots: 0,
    kills: 0,
    deaths: 0,
    weapon: ''
};

const columnNames = _.keys(defaultStats);


let instance;

function WeaponStatsController() {
    return !instance ? instance = this : instance;
}

extend(WeaponStatsController, function () {
    this.getStats = (playerid32, serverid, callback) => {
        let querySelect = query.select().from('weaponstats').where(playerid32, serverid).build();

        dbConnection.getConnection().query(querySelect, (err, res) => {
            if (err) {
                LOG.error(`Request error, query was ${querySelect}`, err);
                return callback([defaultStats]);
            }

            callback(_.isEmpty(res) ? [defaultStats] : res);
        });
    };
    this.updateStats = (playerid, serverid, data) => {
        LOG.info(data);
        _.each(data, (stats, weapon) => {
            let statsData = _.assign(defaultStats, stats, {weapon, playerid: _.parseInt(playerid), serverid: _.parseInt(serverid)});
            let arr = _.map(stats, (v, k) => `${k} = ${v} `);
            let queryUpdate = `${query.insert().into('weaponstats')
                .set(statsData)
                .build()} ON DUPLICATE KEY UPDATE ${arr.toString()}`;

            LOG.info('Query = ', queryUpdate);
            this.insertStats(queryUpdate);
        });
    };

    this.insertStats = query => {
        LOG.info('Try to insert');
        dbConnection.getConnection().query(query, (err, res) => {
            if (err) {
                LOG.error(err);
            } else {
                LOG.info('Data was insert to weaponstats, res = ', res);
            }
        });
    };
});

// WeaponStatsController.prototype = {
//     getStats: (playerid32, serverid, callback) => {
//         let querySelect = select.from('weaponstats').where(playerid32, serverid).build();
//
//         dbConnection.getConnection().query(querySelect, (err, res) => {
//             if (err) {
//                 LOG.error(`Request error, query was ${querySelect}`, err);
//                 return callback([defaultStats]);
//             }
//
//             callback(_.isEmpty(res) ? [defaultStats] : res);
//         });
//     },
//     updateStats: (playerid, serverid, data) => {
//         LOG.info(data);
//         _.each(data, (stats, weapon) => {
//             let statsData = _.assign(defaultStats, stats, {weapon, playerid, serverid});
//             let arr = _.map(stats, (v, k) => `${k} = ${v}`);
//
//             let queryUpdate = `${insert.into('weaponstats')
//                 .set(statsData)
//                 .build()} ON DUPLICATE KEY UPDATE ${arr.toString()}`;
//
//             LOG.info('Query = ', queryUpdate);
//             this.insertStats(queryUpdate);
//         });
//     },
//
//     insertStats: query => {
//         LOG.info('Try to insert');
//         dbConnection.getConnection().query(query, (err, res) => {
//             if (err) {
//                 LOG.error(err);
//             } else {
//                 LOG.info('Data was insert to weaponstats, res = ', res);
//             }
//         });
//
//     }
// };


module.exports = WeaponStatsController;