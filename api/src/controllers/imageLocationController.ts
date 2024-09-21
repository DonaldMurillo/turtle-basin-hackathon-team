import mbxClient from '@mapbox/mapbox-sdk';
import datasetsClient from '@mapbox/mapbox-sdk/services/datasets';
import { clsx, type ClassValue } from 'clsx';
import { Request, Response } from 'express';
import { Feature } from 'geojson';
import OpenAI from 'openai';
import { twMerge } from 'tailwind-merge';
import { v4 as uuidv4 } from 'uuid';

import { pushToMapBox } from '../utils';
const MILES_TO_KILOMETERS = 1.60934;
const EARTH_RADIUS_KM = 6371;

// const prisma = new PrismaClient();

export const submitImageLocation = async (req: Request, res: Response) => {
	const { image, location } = req.body;

	if (!image) {
		return res.status(400).json({ error: 'Image is required' });
	}

	try {
		// Here you would typically process the image (e.g., save to S3) and save the data to your database
		// For this example, we'll just log the data and return a success message

		console.log('Received image data:', image.substring(0, 50) + '...');
		console.log('Received location:', location);

		if (location.latitude && location.longitude) {
			console.log('elooohere');
			await pushToMapBox(location.latitude, location.longitude);
		}
		// Example of saving to database (uncomment and adjust as needed):
		// const submission = await prisma.imageSubmission.create({
		//   data: {
		//     imageUrl: 'url_to_saved_image',
		//     latitude: location.latitude,
		//     longitude: location.longitude,
		//     userId: req.user.id, // Assuming you have user authentication in place
		//   },
		// });
		const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

		const response = await openai.chat.completions.create({
			model: 'gpt-4o-mini',
			messages: [
				{
					role: 'user',
					content: [
						{ type: 'text', text: 'What’s in this image?' },
						{
							type: 'image_url',
							image_url: {
								url: `data:image/jpeg;base64,${image}`,
							},
						},
					],
				},
			],
		});

		console.log(response);

		res.status(200).json({ message: 'Image and location submitted successfully' });
	} catch (error) {
		console.error('Error processing submission:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};
