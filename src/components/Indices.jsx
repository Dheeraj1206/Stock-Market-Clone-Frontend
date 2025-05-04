import React, { useState, useRef, useEffect } from 'react';
import IndexCard from './IndexCard';

const Indices = ({ indices = [] }) => {
	const [scrollPosition, setScrollPosition] = useState(0);
	const [activeIndex, setActiveIndex] = useState(0);
	const [selectedIndex, setSelectedIndex] = useState(null);
	const [indexDetails, setIndexDetails] = useState(null);
	const scrollContainerRef = useRef(null);
	const totalSlides = indices.length;
	const visibleSlides = 3; // Number of slides visible at once

	// Function to scroll left
	const scrollLeft = () => {
		if (scrollContainerRef.current) {
			const container = scrollContainerRef.current;
			const newIndex = Math.max(activeIndex - 1, 0);
			const scrollAmount = container.children[0]?.offsetWidth || 240;
			const newPosition = newIndex * scrollAmount;

			container.scrollTo({ left: newPosition, behavior: 'smooth' });
			setScrollPosition(newPosition);
			setActiveIndex(newIndex);
		}
	};

	// Function to scroll right
	const scrollRight = () => {
		if (scrollContainerRef.current) {
			const container = scrollContainerRef.current;
			const maxIndex = Math.max(0, totalSlides - visibleSlides);
			const newIndex = Math.min(activeIndex + 1, maxIndex);
			const scrollAmount = container.children[0]?.offsetWidth || 240;
			const newPosition = newIndex * scrollAmount;

			container.scrollTo({ left: newPosition, behavior: 'smooth' });
			setScrollPosition(newPosition);
			setActiveIndex(newIndex);
		}
	};

	// Handle index card click
	const handleIndexClick = (index, details) => {
		setSelectedIndex(selectedIndex === index ? null : index);
		if (details) {
			setIndexDetails(details);
		}
	};

	// Auto-scroll every 5 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			if (activeIndex < totalSlides - visibleSlides) {
				scrollRight();
			} else {
				// Reset to beginning
				if (scrollContainerRef.current) {
					scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
					setScrollPosition(0);
					setActiveIndex(0);
				}
			}
		}, 5000);

		return () => clearInterval(interval);
	}, [activeIndex, totalSlides]);

	// If there are no indices, show a loading message
	if (!indices || indices.length === 0) {
		return (
			<div className="mb-4">
				<div className="flex items-center justify-between mb-2">
					<h2 className="text-xl font-semibold">Market Indices</h2>
					<a
						href="#"
						className="text-sm text-green-500 hover:text-green-600 font-semibold"
					>
						All Indices
					</a>
				</div>
				<div className="text-center py-4">No indices data available</div>
			</div>
		);
	}

	return (
		<div className="mb-4">
			<div className="flex items-center justify-between mb-2">
				<h2 className="text-xl font-semibold">Market Indices</h2>

				{/* Slider indicator in the header */}
				<div className="flex items-center gap-2">
					<a
						href="#"
						className="text-sm text-green-500 hover:text-green-600 font-semibold"
					>
						All Indices
					</a>
				</div>
			</div>

			<div className="relative px-6 py-2">
				{/* Left slider button */}
				<button
					onClick={scrollLeft}
					className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100 ${
						activeIndex === 0
							? 'opacity-50 cursor-not-allowed'
							: 'opacity-80 hover:opacity-100'
					}`}
					disabled={activeIndex === 0}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						viewBox="0 0 16 16"
					>
						<path
							fillRule="evenodd"
							d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
						/>
					</svg>
				</button>

				{/* Right slider button */}
				<button
					onClick={scrollRight}
					className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100 ${
						activeIndex >= totalSlides - visibleSlides
							? 'opacity-50 cursor-not-allowed'
							: 'opacity-80 hover:opacity-100'
					}`}
					disabled={activeIndex >= totalSlides - visibleSlides}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						viewBox="0 0 16 16"
					>
						<path
							fillRule="evenodd"
							d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
						/>
					</svg>
				</button>

				<div
					ref={scrollContainerRef}
					className="flex overflow-x-hidden scroll-smooth px-1"
				>
					{indices.map((index, i) => (
						<IndexCard
							key={i}
							title={index.title}
							value={index.value}
							change={index.change}
							isPositive={index.isPositive}
							symbol={index.symbol}
							onClick={(details) => handleIndexClick(i, details)}
						/>
					))}
				</div>

				{/* Details panel for the selected index */}
				{selectedIndex !== null && indexDetails && (
					<div className="mt-4 p-3 bg-white border border-gray-200 rounded-lg shadow-md">
						<div className="flex justify-between items-center mb-2">
							<div>
								<div className="text-sm font-medium">
									{indices[selectedIndex]?.title}
								</div>
								<div className="text-xs text-gray-500">
									{indices[selectedIndex]?.symbol}
								</div>
							</div>
							<button
								onClick={() => setSelectedIndex(null)}
								className="text-gray-500 hover:text-gray-700"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									fill="currentColor"
									viewBox="0 0 16 16"
								>
									<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
								</svg>
							</button>
						</div>

						<div className="grid grid-cols-2 gap-x-4 gap-y-2">
							<div>
								<div className="text-xs text-gray-500">Open</div>
								<div className="text-sm">₹{indexDetails.open}</div>
							</div>
							<div>
								<div className="text-xs text-gray-500">Close</div>
								<div className="text-sm">₹{indexDetails.close}</div>
							</div>
							<div>
								<div className="text-xs text-gray-500">High</div>
								<div className="text-sm">₹{indexDetails.high}</div>
							</div>
							<div>
								<div className="text-xs text-gray-500">Low</div>
								<div className="text-sm">₹{indexDetails.low}</div>
							</div>
						</div>
						<div className="mt-2 pt-2 border-t border-gray-100">
							<div className="text-xs text-gray-500">Volume</div>
							<div className="text-sm">{indexDetails.volume}</div>
						</div>
						<div className="mt-2 text-xs text-gray-400 text-right">
							Last updated: {indexDetails.lastUpdated}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Indices;
