import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import About from './pages/About';
import Account from './pages/Account';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import NewRoute from './pages/NewRoute';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { AppProvider } from '../contexts/AppContext';
import { UserProvider } from '../contexts/UserContext';

import PopUp from '@/src/components/PopUp';

export function App() {
	return (
		<AppProvider>
			<UserProvider>
				<Router>
					<div className="flex flex-col min-h-screen">
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/sign-in" element={<SignIn />} />
							<Route path="/sign-up" element={<SignUp />} />
							<Route path="/account" element={<Account />} />
							<Route path="/forgot-password" element={<ForgotPassword />} />
							<Route path="/new-route" element={<NewRoute />} />
							<Route path="/popup" element={<PopUp />} />
							<Route path="/about" element={<About />} />
						</Routes>
					</div>
				</Router>
			</UserProvider>
		</AppProvider>
	);
}

export default App;
