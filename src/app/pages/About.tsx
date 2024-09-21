import { AlertCircle, Droplet, MapPin, Phone } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/src/components/Navbar';

const AboutPage: React.FC = () => {
	return (
		<>
			<Navbar />
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-6">About Turtle Basin</h1>

				<Card className="mb-6">
					<CardHeader>
						<CardTitle>Our Mission</CardTitle>
					</CardHeader>
					<CardContent>
						<p>
							Turtle Basin is dedicated to empowering communities by providing a platform for quick and efficient reporting of flooding issues. Our
							goal is to facilitate rapid response and mitigation of flood-related problems.
						</p>
					</CardContent>
				</Card>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
					<Card>
						<CardHeader>
							<CardTitle>Key Features</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="list-disc list-inside space-y-2">
								<li className="flex items-center">
									<MapPin className="mr-2 h-4 w-4" />
									Precise location reporting
								</li>
								<li className="flex items-center">
									<Droplet className="mr-2 h-4 w-4" />
									Flood severity classification
								</li>
								<li className="flex items-center">
									<AlertCircle className="mr-2 h-4 w-4" />
									Real-time alerts
								</li>
								{/* <li className="flex items-center">
									<Phone className="mr-2 h-4 w-4" />
									Emergency contact integration
								</li> */}
							</ul>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>How It Works</CardTitle>
						</CardHeader>
						<CardContent>
							<ol className="list-decimal list-inside space-y-2">
								<li>Report a flooding issue through the app</li>
								<li>Local authorities can access real-time data</li>
								{/* <li>Community members receive alerts</li> */}
								<li>Track the status of reported issues</li>
							</ol>
						</CardContent>
					</Card>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Get Involved</CardTitle>
						<CardDescription>Join our community efforts to combat flooding</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col sm:flex-row gap-4">
						{/* <Button>Download the App</Button> */}
						{/* <Button variant="outline">Contact Us</Button> */}
					</CardContent>
				</Card>
			</div>
		</>
	);
};

export default AboutPage;
