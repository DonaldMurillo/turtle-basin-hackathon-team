/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import * as path from 'path';

import cors from 'cors';
import express from 'express';
import session from 'express-session';
import OpenAI from 'openai';
import swaggerUi from 'swagger-ui-express';

import { swaggerSpec } from './config/swagger';
import { submitImageLocation } from './controllers/imageLocationController';
import authRoutes from './routes/auth/authRoutes';
import userImpersonationRoutes from './routes/auth/userImpersonationRoutes';
import userProfileRoutes from './routes/userProfile/userProfileRoutes';

require('dotenv').config();
//const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

//console.log(process.env.OPENAI_API_KEY);
const app = express();
app.use(cors());

app.use(express.json({ limit: '50mb' }));

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

// app.use('/auth', authRoutes);
//app.use('/auth', userImpersonationRoutes);
//app.use('/', userProfileRoutes);
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const poem = `
<h1>A Quiet Night</h1>
<p>In the quiet of the night,<br>
Stars shimmer with delight.<br>
Whispers of the breeze,<br>
Carry secrets through the trees.</p>
`;
/*
app.get('/poem', async (req, res) => {
	const completion = await openai.chat.completions.create({
		model: 'gpt-4o-mini',
		messages: [
			{ role: 'system', content: 'You are a helpful assistant.' },
			{
				role: 'user',
				content: 'Write a haiku about recursion in programming.',
			},
		],
	});
	console.log(completion.choices[0].message);
	res.send(completion.choices[0].message);
});
*/
app.post('/submit-image-location', submitImageLocation);

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
