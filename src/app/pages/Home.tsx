import React from 'react';
import { Link } from 'react-router-dom';

import AppMap from './Map';

import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import Navbar from '@/src/components/Navbar';
import PopUp from '@/src/components/PopUp';

export default function Home() {
	return (
		<>
			<Navbar />
			<AppMap />
			{/* PopUp Component Positioned at Lower Right */}
			<div className="absolute bottom-4 right-4">
				<PopUp />
			</div>
		</>
	);
}
