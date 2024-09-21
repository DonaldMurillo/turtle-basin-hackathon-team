import mbxClient from '@mapbox/mapbox-sdk';
import datasetsClient from '@mapbox/mapbox-sdk/services/datasets';
import { clsx, type ClassValue } from 'clsx';
import { Feature } from 'geojson';
import { twMerge } from 'tailwind-merge';
import { v4 as uuidv4 } from 'uuid';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

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
