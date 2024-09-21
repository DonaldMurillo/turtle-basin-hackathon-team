// components/PopUp.tsx
import axios from 'axios';
import { Plus } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

import defaultImage from '../assets/default-image.png'; // Ensure you have a default image in this path

import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';

// Import a default image or use a data URL

// axios.options('http//:localhost:3333');

interface Location {
	latitude: number;
	longitude: number;
}

const PopUp: React.FC = () => {
	const [isCameraActive, setIsCameraActive] = useState(false);
	const [capturedImage, setCapturedImage] = useState<string | null>(null);
	const [location, setLocation] = useState<Location | null>(null);
	const [error, setError] = useState<string | null>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const mediaStreamRef = useRef<MediaStream | null>(null);

	// Start camera and get location when isCameraActive is true
	useEffect(() => {
		if (isCameraActive) {
			// Camera access
			navigator.mediaDevices
				.getUserMedia({ video: true })
				.then(stream => {
					mediaStreamRef.current = stream;
					if (videoRef.current) {
						videoRef.current.srcObject = stream;
						videoRef.current.play();
					}
				})
				.catch(err => {
					console.error('Error accessing camera: ', err);
					setError('Unable to access camera.');
					setIsCameraActive(false);
				});

			// Location access
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					position => {
						setLocation({
							latitude: position.coords.latitude,
							longitude: position.coords.longitude,
						});
					},
					err => {
						console.error('Error accessing location: ', err);
						setError(prev => (prev ? prev + ' Unable to access location.' : 'Unable to access location.'));
					}
				);
			} else {
				setError(prev => (prev ? prev + ' Geolocation is not supported by this browser.' : 'Geolocation is not supported by this browser.'));
			}
		}

		return () => {
			if (mediaStreamRef.current) {
				mediaStreamRef.current.getTracks().forEach(track => track.stop());
			}
		};
	}, [isCameraActive]);

	const handleCapture = () => {
		if (videoRef.current && canvasRef.current) {
			const video = videoRef.current;
			const canvas = canvasRef.current;
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;
			const ctx = canvas.getContext('2d');
			if (ctx) {
				ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
				const dataUrl = canvas.toDataURL('image/png');
				if (dataUrl && dataUrl !== 'data:,') {
					setCapturedImage(dataUrl);
				} else {
					setCapturedImage(null);
					setError('Failed to capture image.');
				}
				setIsCameraActive(false);
				if (mediaStreamRef.current) {
					mediaStreamRef.current.getTracks().forEach(track => track.stop());
				}
			} else {
				setCapturedImage(null);
				setError('Failed to get canvas context. Submitting default image.');
			}
		} else {
			setCapturedImage(null);
			setError('Video or Canvas element not found. Submitting default image.');
		}
	};

	const handleShareCameraAndLocation = () => {
		setError(null);
		setIsCameraActive(true);
	};

	const handleSubmit = async () => {
		if (!capturedImage && !location) {
			setError('No image captured or location available.');
			return;
		}

		try {
			const response = await axios.post('http://localhost:3333/submit-image-location', {
				image: capturedImage || defaultImage,
				location: location || { latitude: null, longitude: null },
			});

			console.log('Submission successful:', response.data);
			// Handle successful submission (e.g., show a success message)
		} catch (error) {
			console.error('Error submitting data:', error);
			setError('Failed to submit data. Please try again.');
		}
	};

	return (
		<>
			<Dialog>
				<DialogTrigger asChild>
					<button className="p-4 bg-blue-500 text-white rounded-full hover:bg-blue-600">
						<Plus className="h-6 w-6" />
					</button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-lg">
					<DialogHeader>
						<DialogTitle>Camera and Location Modal</DialogTitle>
					</DialogHeader>
					<div className="mt-4 flex flex-col items-center">
						{error && <p className="text-red-500 mb-4 text-center">{error}</p>}
						{!capturedImage && (
							<>
								{isCameraActive ? (
									<div className="flex flex-col items-center">
										<video ref={videoRef} className="w-full max-w-md" autoPlay playsInline muted />
										<Button onClick={handleCapture} className="mt-4">
											Take Picture
										</Button>
									</div>
								) : (
									<Button onClick={handleShareCameraAndLocation} className="w-full">
										Share Camera and Location
									</Button>
								)}
							</>
						)}
						{capturedImage && (
							<div className="flex flex-col items-center">
								<img src={capturedImage !== 'data:,' ? capturedImage : defaultImage} alt="Captured" className="w-full max-w-md" />
								<Button
									onClick={() => {
										setCapturedImage(null);
										setIsCameraActive(true); // Activate camera for retake
										setLocation(null); // Reset location
										setError(null); // Reset errors
									}}
									className="mt-4"
								>
									Retake
								</Button>
							</div>
						)}
					</div>
					<DialogFooter>
						<DialogClose asChild>
							<Button onClick={handleSubmit} className="w-full" variant="secondary">
								Submit
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			{/* Hidden Canvas for capturing the image */}
			<canvas ref={canvasRef} className="hidden" />
		</>
	);
};

export default PopUp;
