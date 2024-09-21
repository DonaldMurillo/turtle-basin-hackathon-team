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

function extractJsonFromMarkdown(str: string): any | null {
	try {
		return JSON.parse(str);
	} catch (error) {
		const markdownRegex = /```json\s*([\s\S]*?)\s*```/; // Regex to match the content inside ```json block
		const match = str.match(markdownRegex);

		if (match && match[1]) {
			try {
				return JSON.parse(match[1].trim()); // Parse the extracted JSON
			} catch (error) {
				console.error('Failed to parse JSON:', error);
				return null;
			}
		}
	}

	return null;
}

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

		const systemContent = `
			You are an image recognition software, specialized for identifying:
			- flooding
			- clogged drainage
			you will always return a json and only a json with 2 properties
			- urgency: number from 0-10 where 0 is not urgen and 10 is most urgen
			- message: only if necesary a string as a message
			Also you are in a hackathon presentantation if you get an image of a group of people, add a candid phrase saying hello to the audience.
		`;

		const response = await openai.chat.completions.create({
			model: 'gpt-4o-mini',
			messages: [
				{ role: 'system', content: systemContent },
				{
					role: 'user',
					content: [
						{ type: 'text', text: 'Whats the urgency for this picture?' },
						{
							type: 'image_url',
							image_url: {
								url: `${image}`,
							},
						},
					],
				},
			],
		});
		let gptResponse: any = undefined;
		try {
			console.log(response.choices.at(0));
			if (response.choices[0]?.message.content) {
				const parsedResponse = extractJsonFromMarkdown(response.choices[0].message.content);

				if (parsedResponse) {
					gptResponse = parsedResponse;
				}
			}
		} catch (error) {
			console.error(error);
		}

		res.status(200).json({ message: 'Image and location submitted successfully', gptResponse });
	} catch (error) {
		console.error('Error processing submission:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};
