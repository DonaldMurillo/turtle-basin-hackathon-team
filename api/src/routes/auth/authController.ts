// api/src/routes/auth/authController.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';

export const register = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	try {
		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			return res.status(400).json({ error: 'User already exists' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
			},
		});

		res.status(201).json({ message: 'User registered successfully', userId: user.id });
	} catch (error) {
		res.status(500).json({ error: 'Internal server error' });
	}
};

export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	try {
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}

		const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '15m' });
		const refreshToken = jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

		await prisma.session.create({
			data: {
				userId: user.id,
				refreshToken,
			},
		});

		res.json({ accessToken, refreshToken });
	} catch (error) {
		res.status(500).json({ error: 'Internal server error' });
	}
};

export const refreshToken = async (req: Request, res: Response) => {
	const { refreshToken } = req.body;

	try {
		const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: string };
		const session = await prisma.session.findFirst({
			where: {
				userId: payload.userId,
				refreshToken,
			},
		});

		if (!session) {
			return res.status(401).json({ error: 'Invalid refresh token' });
		}

		const newAccessToken = jwt.sign({ userId: payload.userId }, JWT_SECRET, { expiresIn: '15m' });
		res.json({ accessToken: newAccessToken });
	} catch (error) {
		res.status(401).json({ error: 'Invalid refresh token' });
	}
};
