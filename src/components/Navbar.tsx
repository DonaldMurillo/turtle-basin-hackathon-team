import { MoonIcon, SunIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import Logo from '@/src/components/Logo';

const Navbar: React.FC = () => {
	const [theme, setTheme] = useState('light');

	useEffect(() => {
		document.documentElement.classList.toggle('dark', theme === 'dark');
	}, [theme]);

	const toggleTheme = () => {
		setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
	};

	return (
		<nav className="bg-background border-b">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<div className="flex items-center">
						<div className="flex-shrink-0">
							<Logo />
						</div>
						{/* <div className="hidden md:block">
							<div className="ml-10 flex items-baseline space-x-4">
								<a href="#" className="text-foreground hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md text-sm font-medium">
									Home
								</a>
								<a href="#" className="text-foreground hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md text-sm font-medium">
									About
								</a>
								<a href="#" className="text-foreground hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md text-sm font-medium">
									Services
								</a>
								<a href="#" className="text-foreground hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md text-sm font-medium">
									Contact
								</a>
							</div>
						</div> */}
					</div>
					<div className="flex items-center">
						<Button variant="ghost" size="icon" aria-label="Toggle theme" className="mr-6" onClick={toggleTheme}>
							{theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
						</Button>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
