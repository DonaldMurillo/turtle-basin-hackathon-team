// components/PopUp.tsx
import { Plus } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose,
} from '@/components/ui/dialog';

const PopUp: React.FC = () => {
	const [isCameraActive, setIsCameraActive] = useState(false);
	const [capturedImage, setCapturedImage] = useState<string | null>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const mediaStreamRef = useRef<MediaStream | null>(null);

	// Start camera when isCameraActive is true
	useEffect(() => {
		if (isCameraActive) {
			navigator.mediaDevices
				.getUserMedia({ video: true })
				.then((stream) => {
					mediaStreamRef.current = stream;
					if (videoRef.current) {
						videoRef.current.srcObject = stream;
						videoRef.current.play();
					}
				})
				.catch((err) => {
					console.error('Error accessing camera: ', err);
					setIsCameraActive(false);
				});
		}

		return () => {
			if (mediaStreamRef.current) {
				mediaStreamRef.current.getTracks().forEach((track) => track.stop());
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
				setCapturedImage(dataUrl);
				setIsCameraActive(false);
				if (mediaStreamRef.current) {
					mediaStreamRef.current.getTracks().forEach((track) => track.stop());
				}
			}
		}
	};

	const handleShareCamera = () => {
		setIsCameraActive(true);
	};

	const handleSubmit = () => {
		// Handle the captured image as needed
		console.log('Captured Image:', capturedImage);
		// The modal will close automatically via DialogClose
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
						<DialogTitle>Camera Modal</DialogTitle>
					</DialogHeader>
					<div className="mt-4 flex flex-col items-center">
						{!capturedImage && (
							<>
								{isCameraActive ? (
									<div className="flex flex-col items-center">
										<video ref={videoRef} className="w-full max-w-md" />
										<Button onClick={handleCapture} className="mt-4">
											Take Picture
										</Button>
									</div>
								) : (
									<Button onClick={handleShareCamera} className="w-full">
										Share Camera
									</Button>
								)}
							</>
						)}
						{capturedImage && (
							<div className="flex flex-col items-center">
								<img src={capturedImage} alt="Captured" className="w-full max-w-md" />
								<Button
									onClick={() => {
										setCapturedImage(null);
										setIsCameraActive(true); // Activate camera for retake
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
