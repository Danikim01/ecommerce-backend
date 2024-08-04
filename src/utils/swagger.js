import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import __dirname from '../path.js';

const swaggerOptions = {
    definition:{
        openapi:"3.0.1",
        info:{
            title:"API Documentation",
            description:"API Documentation for the E-commerce project",
        },
    },
    apis: [`${__dirname}/docs/**/*.yaml`],
}

const specs = swaggerJSDoc(swaggerOptions);

export default specs;