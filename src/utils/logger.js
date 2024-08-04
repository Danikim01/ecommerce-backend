
import winston from "winston";
import config from "../config/config.js";
import __dirname from "../path.js";


// Definir un sistema de niveles que tenga la siguiente prioridad (de menor a mayor):
// debug, http, info, warning, error, fatal
const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        debug: 'blue',
        http: 'green',
        info: 'cyan',
        warning: 'yellow',
        error: 'red',
        fatal: 'magenta'
    }
};


//El logger de desarrollo deberá loggear a partir del nivel debug, sólo en consola
const devLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level:'debug',
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: `${__dirname}/logs/errors.log`, 
            level: 'error'
        }),
    ]
});

//El logger del entorno productivo debería loggear sólo a partir de nivel info.
const prodLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level:'info',
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: `${__dirname}/logs/errors.log`, 
            level: 'error'
        }),
    ]
});


const addLogger = (req, res, next) => {
    req.logger = config.node_env === 'development' ? devLogger : prodLogger;
    next();
}

export default addLogger;