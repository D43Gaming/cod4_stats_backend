const config = require('../config');
const mysql = require('mysql');

let connection;
function getConnection() {
    if (!connection) {
        let configParams = config.get("mysql");
        connection = mysql.createConnection(configParams);
    }
    return connection;
}

module.exports = getConnection();