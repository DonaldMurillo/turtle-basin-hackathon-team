import express from 'express';

import { impersonateUser, stopImpersonation, getCurrentUser, isAuthenticated, isAdmin } from './userImpersonation';

const router = express.Router();

// Apply getCurrentUser middleware to all routes
router.use(getCurrentUser);

/**
 * @swagger
 * /auth/impersonate:
 *   post:
 *     summary: Start user impersonation
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - targetUserId
 *             properties:
 *               targetUserId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Impersonation started successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized (non-admin user)
 */
router.post('/impersonate', isAuthenticated, isAdmin, impersonateUser);

/**
 * @swagger
 * /auth/stop-impersonation:
 *   post:
 *     summary: Stop user impersonation
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Impersonation ended successfully
 *       400:
 *         description: Not currently impersonating
 *       401:
 *         description: Not authenticated
 */
router.post('/stop-impersonation', isAuthenticated, stopImpersonation);

/**
 * @swagger
 * /auth/protected:
 *   get:
 *     summary: Example protected route
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully accessed protected route
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Not authenticated
 */
router.get('/protected', isAuthenticated, (req, res) => {
	res.json({ message: 'This is a protected route', user: req.user });
});

export default router;

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         email:
 *           type: string
 *         name:
 *           type: string
 *         role:
 *           type: string
 *           enum: [USER, ADMIN]
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 */
