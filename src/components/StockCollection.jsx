import React, { useState, useEffect } from 'react';
import StockCard from './StockCard';
import { filterValidStocks } from '../utils/stockUtils';

const StockCollection = ({ title, stocks = [] }) => {
	const [filteredStocks, setFilteredStocks] = useState([]);
	const [isFiltering, setIsFiltering] = useState(true);
	const [originalCount, setOriginalCount] = useState(0);

	useEffect(() => {
		// Store the original count for reference
		setOriginalCount(stocks.length);

		if (!stocks || stocks.length === 0) {
			setFilteredStocks([]);
			setIsFiltering(false);
			return;
		}

		// Start with the first 4 stocks to display something quickly
		const initialStocks = stocks.slice(0, 4);
		setFilteredStocks(initialStocks);

		// For now, we'll immediately set isFiltering to false to show the initial stocks
		// This ensures users see data even if the API has issues
		setIsFiltering(false);

		// Optional: still try to filter stocks but don't block the UI
		const filterStocks = async () => {
			try {
				// Filter stocks with a small batch size to avoid overwhelming the API
				const validStocks = await filterValidStocks(stocks, 3);

				// Only display up to 4 valid stocks
				if (validStocks && validStocks.length > 0) {
					const display = validStocks.slice(0, 4);
					console.log(
						`${title}: Found ${validStocks.length} valid stocks out of ${stocks.length}`
					);
					setFilteredStocks(display);
				}
			} catch (error) {
				console.error(`Error filtering stocks for ${title}:`, error);
				// Keep the initial set if filtering fails
			}
		};

		// Filter the stocks after a delay, but don't show loading state
		const timerId = setTimeout(filterStocks, 1000);

		return () => clearTimeout(timerId);
	}, [stocks, title]);

	if (!stocks || stocks.length === 0) {
		return (
			<div className="w-full max-w-[800px]">
				<div className="flex items-center justify-between mb-2">
					<h2 className="text-xl font-semibold">{title}</h2>
					<a
						href="#"
						className="text-sm text-green-500 hover:text-green-600 font-semibold"
					>
						View All
					</a>
				</div>
				<div className="bg-white p-4 rounded shadow-sm text-center text-gray-500 border border-gray-200">
					No stocks data available
				</div>
			</div>
		);
	}

	return (
		<div className="w-full max-w-[800px] mb-6">
			<div className="flex items-center justify-between mb-3">
				<div className="flex items-center">
					<h2 className="text-xl font-semibold">{title}</h2>
					{isFiltering && (
						<div className="ml-2 w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
					)}
				</div>
				<a
					href="#"
					className="text-sm text-green-500 hover:text-green-600 font-semibold"
				>
					View All {originalCount > 4 ? `(${originalCount})` : ''}
				</a>
			</div>
			<div className="flex flex-wrap justify-between">
				{filteredStocks.length > 0 ? (
					filteredStocks.map((stock, index) => (
						<StockCard key={index} stock={stock} />
					))
				) : (
					<div className="w-full bg-white p-4 rounded shadow-sm text-center text-gray-500 border border-gray-200">
						{isFiltering ? 'Loading stocks...' : 'No stocks available'}
					</div>
				)}
			</div>
		</div>
	);
};

export default StockCollection;
