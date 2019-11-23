const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

exports.logger = createLogger({
    level: 'info',
    format: format.combine(
        //format.colorize(),
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }), 
        format.json()
    ),
    transports: [new transports.Console()]
});
