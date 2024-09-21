import mbxClient from '@mapbox/mapbox-sdk';
import datasetsClient from '@mapbox/mapbox-sdk/services/datasets';
import { clsx, type ClassValue } from 'clsx';
import { Feature } from 'geojson';
import { twMerge } from 'tailwind-merge';
import { v4 as uuidv4 } from 'uuid';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const pushToMapBox = async (lat: number, lng: number): Promise<void> => {
	const sampleFeature1: Feature = {
		type: 'Feature',
		geometry: {
			type: 'Point',
			coordinates: [lat, lng], // [longitude, latitude]
		},
		properties: {
			name: 'Sample Location',
			description: 'This is a sample point in Boca Raton, Florida',
			timestamp: new Date().toISOString(),
			category: 'point_of_interest',
		},
	};

	const client = mbxClient({
		accessToken: 'sk.eyJ1IjoibHVjYXMtcnlhbiIsImEiOiJjbTFjNXhrOXkwdWhiMmxxM3BibHBxMjdhIn0.zgkrcdnv7O3_Kot3MZ5-mA',
	});

	const datasetClient = datasetsClient(client);

	try {
		await datasetClient
			.putFeature({
				datasetId: 'cm1bt6rud0zof1smgagk8tjqv', //report-data
				featureId: uuidv4(),
				feature: sampleFeature1,
			})
			.send();
	} catch (err) {
		console.error(err);
	}
};
