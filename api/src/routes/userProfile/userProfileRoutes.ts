// api/src/routes/userProfile/userProfileRoutes.ts

import { PrismaClient } from '@prisma/client';
import express from 'express';
import { z } from 'zod';

import { isAuthenticated } from '../auth/userImpersonation';

const router = express.Router();
const prisma = new PrismaClient();

const updateProfileSchema = z.object({
	name: z.string().optional(),
	profilePicture: z.string().url().optional(),
	bio: z.string().max(500).optional(),
	dateOfBirth: z.string().datetime().optional(),
	phoneNumber: z.string().optional(),
});

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', isAuthenticated, async (req, res) => {
	const userId = req.user?.id;
	if (!userId) {
		return res.status(404).json({ error: 'User not found' });
	}
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			email: true,
			name: true,
			profilePicture: true,
			bio: true,
			dateOfBirth: true,
			phoneNumber: true,
		},
	});

	if (!user) {
		return res.status(404).json({ error: 'User not found' });
	}

	res.json(user);
});

/**
 * @swagger
 * /profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileInput'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.put('/profile', isAuthenticated, async (req, res) => {
	const userId = req.user?.id;
	if (!userId) {
		return res.status(404).json({ error: 'User not found' });
	}
	try {
		const validatedData = updateProfileSchema.parse(req.body);

		const updatedUser = await prisma.user.update({
			where: { id: userId },
			data: validatedData,
			select: {
				id: true,
				email: true,
				name: true,
				profilePicture: true,
				bio: true,
				dateOfBirth: true,
				phoneNumber: true,
			},
		});

		res.json(updatedUser);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({ error: error.errors });
		}
		res.status(500).json({ error: 'Internal server error' });
	}
});

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         email:
 *           type: string
 *         name:
 *           type: string
 *         profilePicture:
 *           type: string
 *         bio:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *           format: date-time
 *         phoneNumber:
 *           type: string
 *     UpdateProfileInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         profilePicture:
 *           type: string
 *         bio:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *           format: date-time
 *         phoneNumber:
 *           type: string
 */
