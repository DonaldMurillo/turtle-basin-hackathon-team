'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type Operation = '+' | '-' | '*' | '/';

export default function NewRoute() {
	const [display, setDisplay] = useState('0');
	const [memory, setMemory] = useState<number | null>(null);
	const [operation, setOperation] = useState<Operation | null>(null);
	const [prevValue, setPrevValue] = useState<number | null>(null);

	const handleNumberClick = (num: string) => {
		setDisplay(prev => (prev === '0' ? num : prev + num));
	};

	const handleOperationClick = (op: Operation) => {
		setOperation(op);
		setPrevValue(parseFloat(display));
		setDisplay('0');
	};

	const handleEqualsClick = () => {
		if (prevValue !== null && operation) {
			const current = parseFloat(display);
			let result: number;
			switch (operation) {
				case '+':
					result = prevValue + current;
					break;
				case '-':
					result = prevValue - current;
					break;
				case '*':
					result = prevValue * current;
					break;
				case '/':
					result = prevValue / current;
					break;
			}
			setDisplay(result.toString());
			setPrevValue(null);
			setOperation(null);
		}
	};

	const handleClearClick = () => {
		setDisplay('0');
		setPrevValue(null);
		setOperation(null);
	};

	const handleBackClick = () => {
		setDisplay(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'));
	};

	const handleMemoryAdd = () => {
		setMemory(prev => (prev ?? 0) + parseFloat(display));
	};

	const handleMemoryRecall = () => {
		if (memory !== null) {
			setDisplay(memory.toString());
		}
	};

	const handleMemoryClear = () => {
		setMemory(null);
	};

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader>
				<CardTitle className="text-2xl font-bold">Calculator</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="bg-gray-100 p-4 rounded-lg mb-4">
					<div className="text-right text-3xl font-mono">{display}</div>
					{memory !== null && <div className="text-right text-sm text-gray-500">M: {memory}</div>}
				</div>
				<div className="grid grid-cols-4 gap-2">
					{[7, 8, 9, 4, 5, 6, 1, 2, 3, 0].map(num => (
						<Button key={num} onClick={() => handleNumberClick(num.toString())} className="h-12 text-lg">
							{num}
						</Button>
					))}
					<Button onClick={() => handleNumberClick('.')} className="h-12 text-lg">
						.
					</Button>
					<Button onClick={handleEqualsClick} className="h-12 text-lg">
						=
					</Button>
					{['+', '-', '*', '/'].map(op => (
						<Button key={op} onClick={() => handleOperationClick(op as Operation)} className="h-12 text-lg">
							{op}
						</Button>
					))}
				</div>
			</CardContent>
			<CardFooter className="flex justify-between">
				<div className="grid grid-cols-3 gap-2 w-full">
					<Button onClick={handleClearClick} className="h-12">
						C
					</Button>
					<Button onClick={handleBackClick} className="h-12">
						←
					</Button>
					<Button onClick={handleMemoryAdd} className="h-12">
						M+
					</Button>
					<Button onClick={handleMemoryRecall} className="h-12">
						MR
					</Button>
					<Button onClick={handleMemoryClear} className="h-12">
						MC
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
}
