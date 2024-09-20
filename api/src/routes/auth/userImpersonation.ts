import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

const prisma = new PrismaClient();

export async function impersonateUser(req: Request, res: Response) {
	const adminId = req.session.userId;
	const targetUserId = req.body.targetUserId;

	if (!adminId) {
		return res.status(401).json({ error: 'Not authenticated' });
	}

	// Check if the current user is an admin
	const admin = await prisma.user.findUnique({
		where: { id: adminId },
	});

	if (admin?.role !== 'ADMIN') {
		return res.status(403).json({ error: 'Not authorized' });
	}

	// Start impersonation
	await prisma.user.update({
		where: { id: targetUserId },
		data: { impersonatedById: adminId },
	});

	// Log the impersonation action
	await prisma.auditLog.create({
		data: {
			action: 'USER_IMPERSONATION_START',
			userId: adminId,
			details: { targetUserId },
		},
	});

	// Update session to impersonate the target user
	req.session.impersonatingUserId = targetUserId;

	res.status(200).json({ message: 'Impersonation started' });
}

export async function stopImpersonation(req: Request, res: Response) {
	const adminId = req.session.userId;
	const impersonatedUserId = req.session.impersonatingUserId;

	if (!impersonatedUserId) {
		return res.status(400).json({ error: 'Not currently impersonating' });
	}

	if (!adminId) {
		return res.status(401).json({ error: 'Not authenticated' });
	}

	// Stop impersonation
	await prisma.user.update({
		where: { id: impersonatedUserId },
		data: { impersonatedById: null },
	});

	// Log the end of impersonation
	await prisma.auditLog.create({
		data: {
			action: 'USER_IMPERSONATION_END',
			userId: adminId,
			details: { impersonatedUserId },
		},
	});

	// Remove impersonation from session
	delete req.session.impersonatingUserId;

	res.status(200).json({ message: 'Impersonation ended' });
}

export async function getCurrentUser(req: Request, res: Response, next: NextFunction) {
	const userId = req.session.impersonatingUserId || req.session.userId;

	if (!userId) {
		return next();
	}

	const user = await prisma.user.findUnique({
		where: { id: userId },
	});

	if (user) {
		req.user = user;
	}

	next();
}

// Middleware to check if user is authenticated
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
	if (req.user) {
		next();
	} else {
		res.status(401).json({ error: 'Not authenticated' });
	}
}

// Middleware to check if user is an admin
export function isAdmin(req: Request, res: Response, next: NextFunction) {
	if (req.user && req.user.role === 'ADMIN') {
		next();
	} else {
		res.status(403).json({ error: 'Not authorized' });
	}
}
