module.exports = function (module) {
    const winston = require('winston');

    const logger = new (winston.Logger) ({
        transports: [
            new winston.transports.Console(),
            // new winston.transports.File({ filename: 'error.log', level: 'error' }),
            new winston.transports.File({ filename: 'application.log' })
        ]
    });
    // let Winston = require('winston');
    // let path = module.filename.split('/').slice(-2).join('/');
    //
    // let logger = new Winston.Logger({
    //     transports : [
    //         new Winston.transports.Console({
    //             colorize: true,
    //             level: 'debug',
    //             label: path
    //         })
    //     ]
    // });

    return logger;
};