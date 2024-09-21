import mbxClient from '@mapbox/mapbox-sdk';
import datasetsClient from '@mapbox/mapbox-sdk/services/datasets';
import { clsx, type ClassValue } from 'clsx';
import { Request, Response } from 'express';
import { Feature } from 'geojson';
import { twMerge } from 'tailwind-merge';
import { v4 as uuidv4 } from 'uuid';
const MILES_TO_KILOMETERS = 1.60934;
const EARTH_RADIUS_KM = 6371;

function getRandomOffset(radius: number, lat: number): [number, number] {
	// Convert 5 miles to kilometers
	const radiusKm = radius * MILES_TO_KILOMETERS;

	// Generate a random angle in radians
	const angle = Math.random() * 2 * Math.PI;

	// Generate a random distance within the radius
	const distance = Math.sqrt(Math.random()) * radiusKm;

	// Calculate the offsets
	const latOffset = (distance / EARTH_RADIUS_KM) * (180 / Math.PI);
	const lngOffset = (distance / (EARTH_RADIUS_KM * Math.cos((Math.PI * lat) / 180))) * (180 / Math.PI);

	return [latOffset * Math.cos(angle), lngOffset * Math.sin(angle)];
}

export const pushToMapBox = async (lat: number, lng: number): Promise<void> => {
	console.log('Original coordinates:', lat, lng);

	// Get random offsets within a 5-mile radius
	const [latOffset, lngOffset] = getRandomOffset(5, lat);

	// Apply the offsets
	const newLat = lat + latOffset;
	const newLng = lng + lngOffset;

	console.log('Modified coordinates:', newLat, newLng);

	try {
		const sampleFeature1: Feature = {
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: [newLat, newLng], // [longitude, latitude]
			},
			properties: {
				name: 'Sample Location',
				description: 'This is a sample point within a 5-mile radius of the original location',
				timestamp: new Date().toISOString(),
				category: 'point_of_interest',
			},
		};

		const client = mbxClient({
			accessToken: 'sk.eyJ1IjoibHVjYXMtcnlhbiIsImEiOiJjbTFjNXhrOXkwdWhiMmxxM3BibHBxMjdhIn0.zgkrcdnv7O3_Kot3MZ5-mA',
		});

		const datasetClient = datasetsClient(client);

		const response = await datasetClient
			.putFeature({
				datasetId: 'cm1bt6rud0zof1smgagk8tjqv', //report-data
				featureId: uuidv4(),
				feature: sampleFeature1,
			})
			.send();

		console.log(response);
	} catch (err) {
		console.error(err);
	}
};

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
			console.log('elooo');
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
