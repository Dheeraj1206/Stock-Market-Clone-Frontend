import React, { useState, useEffect } from 'react';
import ApiService from '../services/apiService';

const StockCard = ({ stock }) => {
	const [stockData, setStockData] = useState({
		price: 0,
		percentChange: 0,
		isLoading: true,
		error: null,
	});

	useEffect(() => {
		// Only fetch if we have a valid symbol
		if (stock?.symbol) {
			fetchStockPrice(stock.symbol);
		}
	}, [stock?.symbol]);

	const fetchStockPrice = async (symbol) => {
		try {
			setStockData((prev) => ({ ...prev, isLoading: true, error: null }));

			// Using the centralized API service
			const data = await ApiService.getStockPrice(symbol);

			setStockData({
				price: data.currentPrice || 0,
				percentChange: parseFloat(data.percentChange) || 0,
				isLoading: false,
				error: null,
			});
		} catch (error) {
			console.error(`Error fetching stock price for ${symbol}:`, error);

			// Set a fallback random price for demo purposes if API fails
			const fallbackPrice = Math.floor(Math.random() * 1000) + 100;
			const fallbackChange = Math.random() * 6 - 3; // Random value between -3 and 3

			setStockData({
				price: fallbackPrice,
				percentChange: fallbackChange,
				isLoading: false,
				error: error.message,
			});
		}
	};

	const formatPrice = (price) => {
		if (!price && price !== 0) return '₹0.00';
		return new Intl.NumberFormat('en-IN', {
			style: 'currency',
			currency: 'INR',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(price);
	};

	const formatPercent = (percent) => {
		if (!percent && percent !== 0) return '0.00';
		return Number(percent).toFixed(2);
	};

	const isPositive = stockData.percentChange >= 0;
	const formattedPrice = formatPrice(stockData.price).replace('₹', ''); // Remove the currency symbol for cleaner display

	return (
		<div className="w-[180px] h-[172px] border border-gray-300 rounded-lg p-4 flex flex-col justify-between mr-2 mb-4 cursor-pointer hover:border-green-500 transition-all duration-200">
			<div className="flex flex-col">
				<span className="text-md font-medium mb-1 truncate">
					{stock?.name || 'Unknown'}
				</span>
				<span className="text-xs text-gray-500 mb-3">
					{stock?.symbol || 'N/A'}
				</span>
			</div>

			<div className="mt-auto">
				{stockData.isLoading ? (
					<div className="animate-pulse">
						<div className="h-7 bg-gray-200 rounded w-3/4 mb-2"></div>
						<div className="h-4 bg-gray-200 rounded w-1/3"></div>
					</div>
				) : (
					<>
						<div className="text-2xl font-semibold mb-2">₹{formattedPrice}</div>
						<div
							className={`text-sm ${
								isPositive ? 'text-green-500' : 'text-red-500'
							} font-medium`}
						>
							{isPositive ? '+' : ''}
							{formatPercent(stockData.percentChange)}%
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default StockCard;
