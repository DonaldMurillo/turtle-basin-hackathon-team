import React from 'react';
import { Link } from 'react-router-dom';
import PopUp from '@/src/components/PopUp';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import AppMap from './Map';

export default function Home() {
	return (
		<>
			<AppMap />
			{/* PopUp Component Positioned at Lower Right */}
			<div className="absolute bottom-4 right-4">
				<PopUp />
			</div>
		</>
	);
}
