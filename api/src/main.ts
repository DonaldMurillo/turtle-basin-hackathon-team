/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as path from 'path';

import express from 'express';
import session from 'express-session';
import swaggerUi from 'swagger-ui-express';

import { swaggerSpec } from './config/swagger';
import authRoutes from './routes/auth/authRoutes';
import userImpersonationRoutes from './routes/auth/userImpersonationRoutes';
import userProfileRoutes from './routes/userProfile/userProfileRoutes';

const app = express();

app.use(express.json());

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
	res.send({ message: 'Welcome to api!' });
});

app.use(
	session({
		secret: process.env.SESSION_SECRET || 'your-secret-key',
		resave: false,
		saveUninitialized: false,
		cookie: { secure: process.env.NODE_ENV === 'production' },
	})
);

app.use('/auth', authRoutes);
app.use('/auth', userImpersonationRoutes);
app.use('/', userProfileRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
