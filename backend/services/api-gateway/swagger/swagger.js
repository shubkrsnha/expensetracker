const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Expense Tracker API",
      version: "1.0.0",
      description:
        "REST API documentation for the Expense Tracker Microservice Application",
    },

    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5003}`,
        description: "Local API Gateway",
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
    "./controllers/*.js",
  ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;