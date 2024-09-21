import fs from 'fs';
import path from 'path';

import { PrismaClient } from '@prisma/client';
import { Express, Request, Response } from 'express';
import multer from 'multer';

const prisma = new PrismaClient();

// Configure multer for file upload
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/');
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});

const upload = multer({ storage: storage });

export function setupImageEndpoints(app: Express) {
	// Endpoint to save an image file
	app.post('/upload-image', upload.single('image'), async (req: Request, res: Response) => {
		if (!req.file) {
			return res.status(400).json({ error: 'No file uploaded' });
		}

		try {
			const image = await prisma.image.create({
				data: {
					filename: req.file.filename,
					path: req.file.path,
				},
			});

			res.status(201).json({ message: 'Image uploaded successfully', image });
		} catch (error) {
			console.error('Error saving image to database:', error);
			res.status(500).json({ error: 'Failed to save image information' });
		}
	});

	// Endpoint to serve an image file
	app.get('/image/:id', async (req: Request, res: Response) => {
		const { id } = req.params;

		try {
			const image = await prisma.image.findUnique({
				where: { id: parseInt(id) },
			});

			if (!image) {
				return res.status(404).json({ error: 'Image not found' });
			}

			if (!fs.existsSync(image.path)) {
				return res.status(404).json({ error: 'Image file not found' });
			}

			res.sendFile(path.resolve(image.path));
		} catch (error) {
			console.error('Error serving image:', error);
			res.status(500).json({ error: 'Failed to serve image' });
		}
	});
}
