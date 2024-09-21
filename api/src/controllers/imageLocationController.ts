// import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

import { pushToMapBox } from '../utils';

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

		res.status(200).json({ message: 'Image and location submitted successfully' });
	} catch (error) {
		console.error('Error processing submission:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};
