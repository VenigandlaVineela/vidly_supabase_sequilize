const winston = require('winston');

module.exports = function() {
    // Handle uncaught exceptions
    winston.exceptions.handle(
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
        new winston.transports.File({ filename: 'uncaughtExceptions.log' })
    );

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (ex) => {
        throw ex;
    });

    // Log all errors to a file called logfile.log
    winston.add(new winston.transports.File({ filename: 'logfile.log' }));
};