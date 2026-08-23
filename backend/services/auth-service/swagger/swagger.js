const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Expense Tracker Auth API",
      version: "1.0.0",
      description:
        "Authentication APIs for the Expense Tracker Microservice Application",
    },

    servers: [
      {
        url: "http://localhost:5004",
        description: "Local Auth Service",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  apis: [
    "./routes/*.js",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;