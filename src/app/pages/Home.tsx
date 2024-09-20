import React from 'react';
import { Link } from 'react-router-dom';

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
					<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
						{[
							{ title: 'Feature 1', description: 'Description of feature 1' },
							{ title: 'Feature 2', description: 'Description of feature 2' },
							{ title: 'Feature 3', description: 'Description of feature 3' },
						].map((feature, index) => (
							<div key={index} className="bg-white overflow-hidden shadow rounded-lg">
								<div className="px-4 py-5 sm:p-6">
									<h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
									<p className="mt-1 text-sm text-gray-500">{feature.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</MainLayout>
	);
}
