import React from 'react';

import Footer from '@/components/custom/footer';
import Header from '@/components/custom/header';

interface MainLayoutProps {
	children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
	return (
		<div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-black dark:text-white">
			<Header />
			<main className="flex-grow">{children}</main>
			<Footer />
		</div>
	);
};

export default MainLayout;
