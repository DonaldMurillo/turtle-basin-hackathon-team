import React from 'react';
import { Link } from 'react-router-dom';
import PopUp from '@/src/components/PopUp';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';

export default function Home() {
	return (
		<MainLayout>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24">
				<div className="text-center">
					<h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
						<span className="block">Welcome to</span>
						<span className="block text-indigo-600">Our Amazing Platform</span>
					</h1>
					<p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
						Experience the future of productivity with our cutting-edge tools and seamless integration.
					</p>
					<div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
						<div className="rounded-md shadow">
							<Link to="/sign-up">
								<Button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
									Register Now
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</div>

			<div className="bg-gray-100">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24">
					<div className="relative bg-gray-100 border border-gray-300 rounded-lg p-6 h-64">
						{/* Content inside the rectangle */}
						<p className="text-gray-700">
							This is a rectangle container. You can place any content here. The PopUp button is positioned at the lower
							right corner.
						</p>

						{/* PopUp Component Positioned at Lower Right */}
						<div className="absolute bottom-4 right-4">
							<PopUp />
						</div>
					</div>
				</div>
			</div>
		</MainLayout>
	);
}
