import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'BasicStarter API',
			version: '1.0.0',
			description: 'API documentation for BasicStarter project',
		},
		servers: [
			{
				url: 'http://localhost:3333',
				description: 'Development server',
			},
		],
	},
	apis: ['**/routes/**/*.ts', '../src/config/swagger.ts'], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
