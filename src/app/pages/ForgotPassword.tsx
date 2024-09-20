import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPassword() {
	const [email, setEmail] = useState('');
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Here you would typically send a request to your backend to initiate the password reset process
		// For this example, we'll just set isSubmitted to true
		setIsSubmitted(true);
	};

	return (
		<Card className="m-auto max-w-sm">
			<CardHeader>
				<CardTitle className="text-2xl">Forgot Password</CardTitle>
				<CardDescription>Enter your email address and we'll send you a link to reset your password.</CardDescription>
			</CardHeader>
			<CardContent>
				{!isSubmitted ? (
					<form onSubmit={handleSubmit} className="grid gap-4">
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
						</div>
						<Button type="submit" className="w-full">
							Reset Password
						</Button>
					</form>
				) : (
					<div className="text-center">
						<p className="mb-4">If an account exists for {email}, you will receive a password reset link shortly.</p>
						<Button asChild variant="outline" className="w-full">
							<Link to="/sign-in">Return to Sign In</Link>
						</Button>
					</div>
				)}
				<div className="mt-4 text-center text-sm">
					Remember your password?{' '}
					<Link to="/sign-in" className="underline">
						Sign in
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
